# 04 — Branding Map

> Ye sirf **list** hai. Audit me kuch bhi rename/change nahi kiya gaya. Rebranding karte
> waqt in sab ko ek saath dekhna hoga, warna config/DB/desktop identity tootegi.

## 1) Package / binary identity
| Touchpoint | Path | Current value |
| --- | --- | --- |
| Root package name | `package.json` | `"opencode"` |
| Root description | `package.json` | `"AI-powered development tool"` |
| CLI package name | `packages/cli/package.json` | `"@opencode/cli"` |
| CLI bins | `packages/cli/package.json` | `opencode`, `opencode2` |
| npm shim binary resolution | `packages/cli/bin/opencode.cjs` | `@opencode/cli-<platform>-<arch>`, `opencode` / `opencode2` |
| All workspace packages | `packages/*/package.json` | `@opencode/<name>` |
| Services | `services/*/package.json` | `@opencode/<name>` |

## 2) Config files & directories
| Touchpoint | Path | Current value |
| --- | --- | --- |
| Config filenames | `packages/core/src/config/discovery.ts:12` | `opencode.json`, `opencode.jsonc` |
| Config write default | `packages/core/src/config.ts:474` | `opencode.jsonc` |
| Global app dir name | `packages/util/src/global.ts:12` | `"opencode"` |
| XDG roots | `packages/util/src/global-roots.ts` | `~/.local/share/opencode`, `~/.cache/opencode`, `~/.config/opencode`, `~/.local/state/opencode` |
| System config dir | `packages/core/src/config/discovery.ts` | `/etc/opencode`, `/Library/Application Support/opencode`, `%ProgramData%\opencode` |
| macOS MDM plist | `packages/core/src/config/discovery.ts` | `ai.opencode.managed.plist` |
| Project config | `.opencode/opencode.jsonc` | `$schema: https://opencode.ai/config.json` |
| Repo agents/skills | `.opencode/agent`, `.opencode/commands` etc. | `opencode` |
| DB filename | `packages/cli/src/database-path.ts` | `opencode.db` / `opencode-<channel>.db` |
| Legacy DB | `packages/core/src/database/v1-migration.bun.ts` | `opencode-next.db` |

## 3) Environment variables
Prefix `OPENCODE_` (60+ variables). Examples verified:
`OPENCODE_CONFIG`, `OPENCODE_CONFIG_DIR`, `OPENCODE_CONFIG_CONTENT`, `OPENCODE_DB`,
`OPENCODE_CHANNEL`, `OPENCODE_CLIENT`, `OPENCODE_FLAGS`, `OPENCODE_TEST_HOME`,
`OPENCODE_DISABLE_*`, `OPENCODE_DESKTOP_*`, `OPENCODE_API_KEY`.
Full list: `grep -rhoE 'OPENCODE_[A-Z0-9_]+' packages --include=*.ts --include=*.tsx`.

## 4) Desktop app identity
| Touchpoint | Path | Current value |
| --- | --- | --- |
| Product name | `packages/desktop/package.json` | `"OpenCode"` |
| Author/homepage | `packages/desktop/package.json` | `OpenCode`, `https://opencode.ai` |
| App names | `packages/desktop/src/main/constants.ts` | `OpenCode`, `OpenCode Dev`, `OpenCode Beta` |
| App IDs | `packages/desktop/src/main/constants.ts` | `ai.opencode.desktop[.dev/.beta]` |
| Installer app IDs/schemes | `packages/desktop/electron-builder.config.ts` | `ai.opencode.desktop.*`, scheme `opencode` |
| Installer product names | `packages/desktop/electron-builder.config.ts` | `OpenCode`, `OpenCode Beta`, `OpenCode Dev` |
| Window titles | `packages/desktop/src/main/windows/{appearance,early}.ts` | `"OpenCode"` |
| Protocol registration | `packages/desktop/src/main/lifecycle/environment.ts` | `opencode` |
| Linux metainfo | `packages/desktop/script/copy-metainfo.ts` | `OpenCode` |
| Desktop icons | `packages/desktop/icons/prod/icon.icon/icon.json` | `OpenCode` |

## 5) TUI / theme
| Touchpoint | Path | Current value |
| --- | --- | --- |
| App constant | `packages/tui/src/context/program-status.ts:10` | `"opencode"` |
| Default theme name | `packages/tui/src/context/theme.tsx` | `"opencode"` / `opencode2` |
| Theme config default | `packages/tui/src/component/dialog-config.tsx` | `"opencode"` |
| Theme package | `packages/theme/src/tui/` | opencode themes |

## 6) URLs / web
- `https://opencode.ai/**` — config schema (`$schema`), docs, install, console, inference,
  update, auth, theme.json, tui.json.
- `https://opencode.ai/config.json` — sabse zyada baar (schema references).
- `https://dev.opencode.ai`, `https://update.opencode.ai`, `https://status.opencode.ai`.
- `https://opencode.cafe` (provider/integration).
- Upstream repo URLs: `github.com/anomalyco/opencode` (CHANGELOG/README/CI).

## 7) Docs / meta
| Path | Branding |
| --- | --- |
| `LICENSE` | `Copyright (c) 2025 opencode` — **as-is rahega** |
| `README*.md` | OpenCode logo, name, links, translations |
| `CHANGELOG.md` | `OpenCode V2`, PR links to `anomalyco/opencode` |
| `AGENTS.md` | opencode dev rules |
| `.github/assets/logo-ornate-{dark,light}.svg` | OpenCode logo |
| `.github/workflows/*` | release/deploy references |
| `install` | `APP=opencode`, `SOURCE_APP=opencode` |
| `nix/opencode.nix`, `flake.nix` | OpenCode package/dev shell |
| `packages/identity/` | Brand mark assets |

## 8) Other runtime identifiers
- Provider/integration ID `opencode` (free models, Go upsell): `packages/tui/src/component/dialog-*.tsx`, `packages/core/src/integration*`.
- Plugin config key `opencode.json`: `packages/schema/src/plugin.ts:40`.
- OTel client/log tags: `OPENCODE_ARTIFACT`, `role: "opencode"`.
- CLI help text: `"OpenCode command line interface"` (`packages/cli/src/commands/commands.ts:50`).

## Rebrand applied (2026-11-15) — final values
| Cheez | Value |
| --- | --- |
| Product | RedCode |
| CLI | `redcode`, legacy `redcode2` |
| npm (main) | `redcode-ai` |
| npm (platform) | `redcode-ai-<linux&#124;darwin&#124;windows>-<arm64&#124;x64>[-baseline][-musl]` |
| npm (node) | `redcode-ai-node`, `redcode-ai-node-<target>` |
| Env | `REDCODE_*` (e.g. `REDCODE_BIN_PATH`, `REDCODE_CHANNEL`, `REDCODE_VERSION`, `REDCODE_CONFIG`, `REDCODE_MODELS_SNAPSHOT`) |
| Global dir | `~/.config/redcode/`, XDG data/cache/state = `redcode` |
| Project dir | `.redcode/`, files `redcode.json` / `redcode.jsonc` |
| DB | `redcode.db` |
| System config | `/etc/redcode`, `~/Library/Application Support/redcode`, `%ProgramData%\redcode` |
| Desktop | app id `ai.redcode.desktop`, scheme `redcode`, settings `redcode.settings`, storage `redcode.global.dat` |
| Repo | `https://github.com/Vempire-X/RedCode` |
| Install | `curl -fsSL https://raw.githubusercontent.com/Vempire-X/RedCode/main/install | bash` → `~/.redcode/bin` |

### Shared apne jaisa rakha (rename NAHI kiya)
`opencode.ai` (config.json/tui.json/theme.json/auth/console/inference/update/status), `dev.opencode.ai`,
`.well-known/opencode`, `Provider.ID.opencode`, ACP method ids, provider/model ids, `@opencode/pty`,
`@opencode-ai/sdk`, `@opencode-ai/plugin`, `@brendonovich/vite-plugin-opencode`,
`opencode-helicone-session`, `opencode.nvim`, `opencode-wakatime`, `opencode.ai` ke `opencodeai` catalog field.

