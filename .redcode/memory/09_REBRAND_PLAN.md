# 09 — Rebrand Plan (opencode → RedCode)

> Step 1 inventory + naming decisions + execution log. Prompt #2.

## Naming decisions (final)
| Item | Value |
| --- | --- |
| Product name | **RedCode** |
| CLI command | `redcode` (legacy alias `redcode2`) |
| npm package (main) | **`redcode-ai`** (`redcode` npm par taken hai) |
| Platform packages | `redcode-ai-<os>-<arch>[-baseline][-musl]` |
| Node variant | `redcode-ai-node`, `redcode-ai-node-<os>-<arch>` |
| Env prefix | `REDCODE_` |
| Global config dir | `~/.config/redcode/` (XDG: data/cache/state bhi `redcode`) |
| Project config dir | `.redcode/` |
| Config files | `redcode.json`, `redcode.jsonc` |
| DB | `redcode.db` |
| Version | `0.1.0` |
| Desktop app id | `ai.redcode.desktop[.dev/.beta]`, scheme `redcode` |

## Inventory (audit counts)
- Files containing `opencode` (ci): **4502**
- Unique workspace `@opencode/*` package names: **39** (34 internal + `@opencode/pty` external)
- Unique `OPENCODE_*` env vars: **169**
- `anomalyco/opencode` occurrences: **1441** (mostly CHANGELOG/history + repo metadata)
- Top match groups: `@opencode/ai/providers/*` (~8000), `opencode.ai/config.json` schema URL (2159),
  `@opencode/client` (345), `OPENCODE_SERVER_PASSWORD` (228), `@opencode/plugin/gui` (234).

## Category map
- **A. CLI/binary:** `packages/cli/{package.json,bin/*,script/*}`, root `install`.
- **B. npm packages:** `@opencode/cli` + `@opencode/cli-*` + node variants; publish scripts `.github/release/*`.
- **C. Config dirs/files:** `packages/util/src/global.ts`, `packages/core/src/config/discovery.ts`,
  `packages/core/src/config.ts`, `packages/cli/src/database-path.ts`, repo `.opencode/`.
- **D. Env vars:** 169 `OPENCODE_*` across packages/services/.github/scripts.
- **E. UI text:** `packages/tui/src/context/{program-status,theme,editor}.ts*`,
  `packages/tui/src/component/logo.tsx`, `packages/tui/src/component/dialog-config.tsx`,
  `packages/theme/src/tui/*`.
- **F. Docs/metadata:** `package.json`, `packages/*/package.json` (repository/homepage),
  `README*.md`, `AGENTS.md`, `packages/desktop/*`, `.github/assets/*`.
- **G. URLs/domains:** `opencode.ai/**`, `update.opencode.ai`, `status.opencode.ai`,
  `dev.opencode.ai`, `opencode.cafe`, `github.com/anomalyco/opencode`.
- **H. CI/CD/packaging:** `.github/workflows/*`, `.github/release/*`, `install`, `flake.nix`, `nix/`, `Dockerfile`.
- **I. Internal identifiers:** `@opencode/<workspace>` package names, `opencode-pty` module,
  provider/integration id `opencode`.
- **J. LICENSE/copyright:** `LICENSE` — **DO NOT TOUCH**.

## Preserve / do NOT rename
- `LICENSE` (copyright notice intact)
- `@opencode/pty` + `@opencode/pty-*` (external npm owned by upstream)
- `@brendonovich/vite-plugin-opencode` (external)
- `CHANGELOG.md`, `bun.lock`, `patches/**`, `packages/ai/test/fixtures/**` (recorded HTTP)
- Local build outputs / `node_modules`

## URL buckets (Step 3-G)
1. **Static links (change):** install URL → `https://raw.githubusercontent.com/Vempire-X/RedCode/main/install`;
   repo/homepage/bugs → `github.com/Vempire-X/RedCode`.
2. **opencode-hosted services (keep + report, no silent break):**
   - AI gateway/inference: `opencode.ai/inference/**` (free models / Go)
   - Auth/console: `opencode.ai/auth`, `opencode.ai/console/**`
   - Config schema: `https://opencode.ai/config.json` (`$schema`, static)
   - Theme/tui schema: `opencode.ai/theme.json`, `opencode.ai/tui.json`
   - Update check: `update.opencode.ai`, `opencode.ai/update/**`
   - Telemetry/status: `status.opencode.ai`
   - Provider id `opencode` (integration)
   These remain upstream and will keep talking to opencode servers; several RedCode
   features (free models, Go, share, auto-update to RedCode) will not work until we
   host our own. Reported in final report.
3. **Install script URL:** changed to repo raw URL.

## Execution log (poora)
- [x] Inventory saved.
- [x] Phase 1: npm packaging + bin + build/pack/postinstall + version (`packages/cli/package.json` = `redcode-ai@0.1.0`,
      `bin/{redcode,redcode2}.cjs`, `script/{build,build-node,pack,postinstall}`, root `package.json`).
- [x] Phase 2: env prefix `OPENCODE_`→`REDCODE_`, config dirs (`~/.config/redcode`, XDG data/cache/state),
      config files `redcode.json(c)`, project dir `.redcode/`, db `redcode.db`, `/etc/redcode`,
      `~/Library/Application Support/redcode`, `%ProgramData%\redcode`.
- [x] Phase 3: TUI text/theme (default theme id `redcode`), desktop identity (`ai.redcode.desktop`,
      scheme `redcode`, app-data/log dirs `redcode`, deep links `redcode://`).
- [x] Phase 4: docs/metadata + internal `@opencode/*`→`@redcode/*`, repo/homepage URLs, `.opencode/`→`.redcode/`.
- [x] Phase 5: CI/CD + installer (`install` script, new `.github/workflows/redcode-release.yml`).
- [x] Phase 6: verification (GitHub Actions only) + memory update + branch/PR.

## Kab kya apply hua (scripts)
1. `rebrand.mjs` (broad, protected) — 3970 files: `@opencode/`→`@redcode/`, `OPENCODE_`→`REDCODE_`,
   `OpenCode`→`RedCode`, `.opencode`→`.redcode`, `opencode.json(c)`→`redcode.json(c)`, `anomalyco/opencode`→repo URL.
2. `rebrand-cli.mjs` — `packages/cli/{script,bin}`, `.github/release/*`; phir manual fixes for
   `command`/`legacyCommand`/`binary`/`packagePrefix`, platform package `redcode-ai-*`, `redcode` binary.
3. `fix-opencode.mjs` — 220 files: identifiers (`sources.opencode`, `themes.opencode`) ko revert kiya
   jo `.opencode` rule ne galti se badal diye the.
4. `fix-client.mjs` — 600 files: `redcode-aient` → `@redcode/client` (protection ne `@opencode/cli` prefix
   ko `@opencode/client` me bhi kha liya tha).
5. `rebrand-paths.mjs` — 490 files: `~/.config/opencode`→`redcode`, XDG share/cache/state, `/etc/opencode`,
   `opencode.settings`, `opencode.global.dat`, `opencode-desktop`, `opencode-beta`, `opencode2`, `opencode.exe`,
   `~/.redcode/bin/opencode`→`redcode`, `opencode://`→`redcode://`.
6. `bun.lock`: workspace names `@opencode/*`→`@redcode/*` (path rename), root name `redcode`,
   `packages/cli` → `redcode-ai@0.1.0` + `bin.redcode`; `@opencode/pty*` jaan-boojh kar chhoda.

## Jaan-boojh kar NAHI badla (report me likha)
- `LICENSE` (copyright `2025 opencode` as-is), `CHANGELOG.md`, `bun.lock` ke `@opencode/pty` entries, `patches/**`.
- External packages: `@opencode/pty`, `@opencode-ai/sdk`, `@opencode-ai/plugin`, `@brendonovich/vite-plugin-opencode`.
- opencode-hosted services + protocol ids: `opencode.ai/**` (auth/console/inference/config.json/tui.json/theme.json/
  update/status), `.well-known/opencode`, `Provider.ID.opencode`, ACP ids (`opencode/child-session*`,
  `opencode/session/child_update`, `opencode/compaction`), provider/model ids (`opencode/gpt-*`, `opencode/big-pickle`),
  `opencode-pty`/`opencode-go`/`opencode-helicone-session`/`opencode.nvim`/`opencode-wakatime`/`opencodeai`.
- Internal service identifiers jaise `Context.Service` key `"opencode/desktop/..."` (user ko dikhte nahi; logic same).
- Workspace packages ke `version: 2.3.0` (sirf product packages 0.1.0 par reset hain).

## Verification
- Local build/test **possible nahi** (Android storage: `bun install` → EACCES).
- Isliye verification path = GitHub Actions (`.github/workflows/redcode-release.yml`, `v*` tag).
- `bun.lock` mechanical edit unverified hai; workflow `--no-frozen-lockfile` use karta hai.

## Known breakage / follow-ups
- Free models, Go, share, auto-update: `opencode.ai` endpoints par depend karte hain (upstream). Chaaloo karne ke liye
  apna host chahiye.
- npm publish ke liye repo secret `NPM_TOKEN` chahiye. Provenance (`--provenance`) **use nahi** kiya kyunki npm
  provenance public repo maangta hai.
- `--provenance`/AWS signing/Homebrew/AUR/winget/Docker/Discord publish upstream infra par the; RedCode workflow sirf
  npm + GitHub Release karta hai.
