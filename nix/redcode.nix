{
  lib,
  stdenvNoCC,
  callPackage,
  bun,
  nodejs,
  sysctl,
  makeBinaryWrapper,
  models-dev,
  ripgrep,
  wayland,
  installShellFiles,
  versionCheckHook,
  writableTmpDirAsHomeHook,
  node_modules ? callPackage ./node_modules.nix { },
}:
stdenvNoCC.mkDerivation (finalAttrs: {
  pname = "redcode";
  inherit (node_modules) version src;
  inherit node_modules;

  nativeBuildInputs = [
    bun
    nodejs # for patchShebangs node_modules
    installShellFiles
    makeBinaryWrapper
    models-dev
    writableTmpDirAsHomeHook
  ];

  postPatch = ''
    # NOTE: Relax Bun version check to be a warning instead of an error
    substituteInPlace packages/script/src/index.ts \
      --replace-fail 'throw new Error(`This script requires bun@''${expectedBunVersionRange}' \
                     'console.warn(`Warning: This script requires bun@''${expectedBunVersionRange}'
  '';

  configurePhase = ''
    runHook preConfigure

    cp -R ${finalAttrs.node_modules}/. .
    patchShebangs node_modules
    patchShebangs packages/*/node_modules

    runHook postConfigure
  '';

  env.MODELS_DEV_API_JSON = "${models-dev}/dist/_api.json";
  env.REDCODE_DISABLE_MODELS_FETCH = true;
  env.REDCODE_VERSION = finalAttrs.version;
  env.REDCODE_CHANNEL = "prod";
  env.NODE_OPTIONS = "--max-old-space-size=4096";

  buildPhase = ''
    runHook preBuild

    cd ./packages/cli
    bun --bun ./script/build.ts --single --skip-install

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    install -Dm755 dist/cli-*/bin/redcode $out/bin/redcode

    # OpenTUI dlopens Wayland for clipboard images.
    wrapProgram $out/bin/redcode \
      --prefix PATH : ${
        lib.makeBinPath (
          [
            ripgrep
          ]
          # bun runs sysctl to detect if running on rosetta2
          ++ lib.optional stdenvNoCC.hostPlatform.isDarwin sysctl
        )
      } ${lib.optionalString stdenvNoCC.hostPlatform.isLinux ''
        --prefix LD_LIBRARY_PATH : ${lib.makeLibraryPath [ wayland ]}
      ''}

    ln -s redcode $out/bin/redcode2

    runHook postInstall
  '';

  postInstall = lib.optionalString (stdenvNoCC.buildPlatform.canExecute stdenvNoCC.hostPlatform) ''
    # v2 dropped the `completion` subcommand; --completions is the global flag.
    # --completions also accepts sh, which emits the same script as bash.
    # staged to files, substitute below rejects anything that is not a regular file
    $out/bin/redcode --completions bash > redcode.bash
    $out/bin/redcode --completions zsh > _redcode
    $out/bin/redcode --completions fish > redcode.fish

    installShellCompletion --cmd redcode \
      --bash redcode.bash \
      --fish redcode.fish \
      --zsh _redcode

    # REDCODE_CLI_NAME is a build-time define, so the redcode2 copies are
    # renamed rather than regenerated. --replace-fail is a global literal
    # substitution, so any lowercase redcode that later appears in a
    # description or help text ships as redcode2 in the redcode2 copy.
    substitute redcode.bash redcode2.bash --replace-fail redcode redcode2
    substitute _redcode _redcode2 --replace-fail redcode redcode2
    substitute redcode.fish redcode2.fish --replace-fail redcode redcode2

    installShellCompletion --cmd redcode2 \
      --bash redcode2.bash \
      --fish redcode2.fish \
      --zsh _redcode2
  '';

  nativeInstallCheckInputs = [
    versionCheckHook
    writableTmpDirAsHomeHook
  ];
  doInstallCheck = true;
  versionCheckKeepEnvironment = [ "HOME" "REDCODE_DISABLE_MODELS_FETCH" ];
  versionCheckProgramArg = "--version";

  passthru = {
    env = finalAttrs.env;
  };

  meta = {
    description = "The open source coding agent";
    homepage = "https://github.com/Vempire-X/RedCode";
    license = lib.licenses.mit;
    mainProgram = "redcode";
    inherit (node_modules.meta) platforms;
  };
})
