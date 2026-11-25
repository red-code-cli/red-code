# 08 — Changelog

Har kaam ki entry yahan: date, kya hua, affected files.

## 2026-11-14 — Initial audit
- Poore repo ka read-only audit kiya (structure, tech stack, entry points, core modules,
  data flow, config/storage, branding, CI/CD, dependencies, risks).
- Naya folder banaya: `.redcode/memory/` (00 se 08 tak files).
- Root `README.md` ko RedCode branding ke saath rewrite kiya (purana content git/history
  me safe; source code change nahi).
- `REDCODE_AGENTS.md` banaya (existing `AGENTS.md` overwrite nahi kiya).
- Source code me **koi change nahi** kiya. License as-is.
- GitHub: private repo `Vempire-X/RedCode` create kiya.
  - Baseline source `main` par commit `f523a18` (original upstream README bhi baseline
    me preserved).
  - Docs commits `a45c2f6` + `4f6b903` branch `redcode/initial-audit` par.
  - PR #1: https://github.com/Vempire-X/RedCode/pull/1 (merge nahi kiya).
  - CI note: inherited `check-standards` workflow `dev` branch expect karta hai, isliye
    PR par fail hota hai. Source/workflow change nahi kiya.

### Audit facts captured
- Version: opencode 2.3.0 codebase; Bun 1.4.4; Effect 4.1.0; TypeScript 7.1 beta.
- Repo: 35+ packages, 1,721 test files, 60 e2e spec files.
- Audit time par folder git repository nahi tha.
- `node_modules` maujood nahi; install/build/test execute nahi hue.

## 2026-11-15 — Full rebrand + npm/installer release path
- Poora source-level rebrand `opencode` → **RedCode** (names/branding only; koi feature remove nahi, logic same).
- Product: `redcode` command (`redcode2` legacy alias), npm package **`redcode-ai`** + platform packages
  `redcode-ai-<os>-<arch>[-baseline][-musl]`, version **0.1.0**.
- Env prefix `OPENCODE_`→`REDCODE_`; config `~/.config/redcode/`, project `.redcode/`, `redcode.json(c)`,
  DB `redcode.db`, XDG data/cache/state `redcode`.
- Desktop: app id `ai.redcode.desktop[.dev/.beta]`, scheme `redcode://`, settings `redcode.settings`.
- Repo ka apna config dir `.opencode/` → `.redcode/` (agents/commands/skills/plugins/themes/tool + `redcode.jsonc`).
- Nix: `nix/opencode.nix` → `nix/redcode.nix`, flake attrs `redcode`/`redcode-desktop`.
- CI: blacksmith runner labels → GitHub-hosted (`ubuntu-24.04`, `macos-15`, `windows-2025`, `ubuntu-24.04-arm`).
- Naya `.github/workflows/redcode-release.yml`: `v*` tag par sab platforms build, npm publish (`NPM_TOKEN`),
  GitHub Release. Purana `release.yml` disable (upstream-only infra).
- `bun.lock` ke workspace package names update kiye; `@opencode/pty*` entries as-is.
- `LICENSE` aur upstream copyright as-is.

### Verification status
- Local `bun install`/build/test **abhi bhi possible nahi** (EACCES). Sab kuch **GitHub Actions par unverified**.
- `install` script ab `registry.npmjs.org/redcode-ai-*` se install karta hai aur `~/.redcode/bin` me daalta hai.
- CI branch refs `dev` -> `main` kiye (check*, triage-pr-standards, triage-compliance-close, bot-nix-hashes)
  taaki PR #2 par CI chale aur triage bots crash na karein. Deploy/nightly workflows jaan-boojh kar waise hi
  chhode (wo `dev`/`production` branch par hi trigger hote hain, is repo me wo branch nahi hai).
- PR #2 open/updated: https://github.com/Vempire-X/RedCode/pull/2 (`redcode/rebrand-and-installer` -> `main`).
  Merge **nahi** kiya (user approval baaki).
- PR #2 **merge** ho gaya (squash) -> `main` = `e224c13 chore: full rebrand to RedCode, npm package and installer`.
- PR #1 close kar diya (uske docs PR #2 ke through main me aa gaye).
- `main` par tag: abhi koi nahi.
- GitHub repo secret `NPM_TOKEN` set kiya (Actions secrets API + libsodium sealed box; value commit/disk par save nahi ki).
- Next: `v0.1.0` tag push -> `.github/workflows/redcode-release.yml` build + npm publish + GitHub Release.

