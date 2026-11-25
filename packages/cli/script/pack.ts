#!/usr/bin/env bun
import { $ } from "bun"
import pkg from "../package.json"
import { Script } from "@redcode/script"
import { archiveDir, npmDir } from "@redcode/script/pack"
import { existsSync } from "fs"
import { chmod, mkdir, rm, utimes } from "node:fs/promises"
import path from "node:path"

// Packs the built CLI (dist/) into npm tarballs in dist/npm and standalone archives in dist/archives at
// the repository root. The release workflow signs the macOS and Windows packages and archives afterwards.
const dir = path.resolve(import.meta.dir, "..")
const root = path.join(dir, "dist")
process.chdir(dir)
await mkdir(npmDir, { recursive: true })
await mkdir(archiveDir, { recursive: true })

await packDistribution({
  root,
  name: pkg.name,
  command: "redcode",
  legacyCommand: "redcode2",
  binary: "redcode",
  packagePrefix: "redcode-ai-",
  archive: (target) => target.startsWith("linux-"),
})
if (existsSync(path.join(root, "node"))) {
  await packDistribution({
    root: path.join(root, "node"),
    name: "redcode-ai-node",
    command: "redcode2-node",
    binary: "redcode2-node",
    packagePrefix: "redcode-ai-node-",
    archive: () => true,
  })
}

async function packDistribution(input: {
  root: string
  name: string
  command: string
  legacyCommand?: string
  binary: string
  packagePrefix: string
  archive: (target: string) => boolean
}) {
  const binaries: Set<string> = new Set()
  
  // Look for binary files matching the package prefix (GitHub Actions artifacts case)
  for (const filename of await Bun.file(input.root).json().catch(() => [])) {
    if (filename.startsWith(input.packagePrefix)) {
      binaries.add(filename)
    }
  }
  
  // If no binaries found, search directory for binary files directly
  if (binaries.size === 0) {
    for (const filename of Bun.globSync(`${input.packagePrefix}*`, { cwd: input.root })) {
      binaries.add(filename)
    }
  }
  
  console.log(input.name, "binaries", Array.from(binaries))
  if (binaries.size === 0) throw new Error(`No binary packages found for ${input.name}`)
  
  // Get version from environment (set by GitHub Actions workflow)
  const version = process.env.REDCODE_VERSION || Script.version
  if (!version) throw new Error(`No version available for ${input.name}`)

  await $`mkdir -p ${input.root}/${input.name}/bin`
  await $`cp ./script/postinstall.mjs ${input.root}/${input.name}/postinstall.mjs`
  await Bun.file(`${input.root}/${input.name}/bin/${input.command}.exe`).write(
    [
      `echo "Error: ${input.name}'s postinstall script was not run." >&2`,
      'echo "" >&2',
      'echo "This occurs when installation scripts are disabled." >&2',
      'echo "Run the package postinstall script or reinstall with scripts enabled." >&2',
      "exit 1",
      "",
    ].join("\n"),
  )
  await Bun.file(`${input.root}/${input.name}/package.json`).write(
    JSON.stringify(
      {
        name: input.name,
        bin: {
          [input.command]: `./bin/${input.command}.exe`,
          ...(input.legacyCommand ? { [input.legacyCommand]: `./bin/${input.command}.exe` } : {}),
        },
        ...(input.command !== input.binary ? { redcodeSourceBinary: input.binary } : {}),
        scripts: { postinstall: "node ./postinstall.mjs" },
        version,
        license: pkg.license,
        repository: { type: "git", url: "git+https://github.com/Vempire-X/RedCode.git" },
        os: ["darwin", "linux", "win32"],
        cpu: ["arm64", "x64"],
        optionalDependencies: binaries,
      },
      null,
      2,
    ),
  )

  await Promise.all(Object.keys(binaries).map((name) => pack(`${input.root}/${name}`)))
  await pack(`${input.root}/${input.name}`)
  await Promise.all(
    Object.keys(binaries)
      .map((name) => name.slice(input.packagePrefix.length))
      .filter(input.archive)
      .map((target) =>
        archive(
          path.join(input.root, `${input.packagePrefix}${target}`, "bin"),
          target,
          input.binary,
        ),
      ),
  )
}

async function pack(directory: string) {
  if (process.platform !== "win32") await $`chmod -R 755 .`.cwd(directory)
  await $`bun pm pack --destination ${npmDir}`.cwd(directory)
}

async function archive(bin: string, target: string, binary: string) {
  const executable = `${binary}${target.startsWith("windows-") ? ".exe" : ""}`
  const source = path.join(bin, executable)
  if (!(await Bun.file(source).exists()) || !Bun.file(source).size) throw new Error(`Missing binary: ${source}`)
  // GitHub artifact downloads lose execute bits. Fixed timestamps make retries reproducible.
  await chmod(source, 0o755)
  await utimes(source, new Date("1980-01-01T00:00:00Z"), new Date("1980-01-01T00:00:00Z"))
  const extension = target.startsWith("linux-") ? "tar.gz" : "zip"
  const output = path.join(archiveDir, `${binary}-${target}.${extension}`)
  await rm(output, { force: true })
  if (extension === "tar.gz") {
    await $`tar --mtime=@0 --owner=0 --group=0 --numeric-owner -czf ${output} -C ${bin} ${executable}`
  }
  if (extension === "zip") await $`zip -X -q ${output} ${executable}`.cwd(bin)
  return output
}
