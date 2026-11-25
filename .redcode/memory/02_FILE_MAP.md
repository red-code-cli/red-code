# 02 — File Map

> Sirf wahi files/folders jinka purpose audit ke dauraan padha/grep kiya gaya. Jo verify
> nahi hua, usse "Unknown" maana gaya hai.

## Root
| Path | Kaam |
| --- | --- |
| `package.json` | Bun workspace root, scripts, dependency catalog, version 2.3.0 |
| `bun.lock` | Bun lockfile (596 KB) |
| `bunfig.toml` | Install settings (`minimumReleaseAge = 3 days`) + test root guard |
| `turbo.json` | Turborepo task graph (`typecheck`, `typecheck:tsc`) |
| `AGENTS.md` | Upstream repo ke development rules (abhi as-is) |
| `CHANGELOG.md` | Upstream release notes (v2.3.0 latest) |
| `LICENSE` | MIT, Copyright (c) 2025 opencode — **do not touch** |
| `README.md` | Ab RedCode README (audit me replace hua) |
| `README.*.md` | Upstream translations (as-is) |
| `CONTRIBUTING.md`, `SECURITY.md` | Upstream contribution/security docs |
| `install` | Bash installer |
| `flake.nix`, `flake.lock`, `nix/` | Nix packaging/dev shell |
| `.gitignore` | Secrets/build outputs ignore (`.env`, `node_modules`, `dist`, ...) |
| `.dockerignore` | Docker build exclusions |
| `.oxlintrc.json`, `.prettierignore` | Lint/format config |
| `.opencode/` | Repo ka apna opencode config, agents, commands, skills, glossary |
| `.github/` | Workflows, release scripts, logo assets |

## packages/ (35+)
| Package | Kaam (verified) |
| --- | --- |
| `ai` | Provider adapters, model transport, LLM client (`@opencode/ai`) |
| `app` | Web app (Vite + Solid); `src/{home,composer,session,settings,workspaces,...}` |
| `cli` | CLI entry, commands, server connection, ACP, run, TUI integration |
| `client` | Server HTTP client |
| `codemode` | Effect-native confined code execution over tools |
| `core` | Main domain logic: sessions, tools, config, MCP, plugins, permissions, DB |
| `data` | Nested workspace: `app` (SolidStart site), `core` (schema/migrations/domains), `server` (Cloudflare Workers sync) |
| `desktop` | Electron desktop app (main/preload/renderer) |
| `effect-drizzle-sqlite` | Effect + Drizzle SQLite integration (examples dir) |
| `gui-plugins` | GUI plugin runtime (browser, file, goal, office, ...) |
| `http-recorder` | HTTP/WebSocket record-replay cassettes |
| `httpapi-codegen` | HTTP API code generation |
| `identity` | Brand mark assets (PNG/SVG), no code |
| `latex` | LaTeX support |
| `merman` | Markdown/diagram rendering (flowchart, gantt, gitgraph, palette) |
| `nav-menus` | Navigation menu UI + `brand.ts` |
| `patchmark` | Patch/markdown streaming + heal logic |
| `plugin` | Plugin SDK: `effect/`, `promise/`, `gui/` |
| `plugin-browser` | Desktop browser plugin |
| `plugins/figma` | Figma plugin workspace |
| `process-daemon` | Rust PTY/process daemon (Cargo) |
| `protocol` | HTTP API contract/definitions/types |
| `schema` | Effect Schema definitions (config, events, model, session, MCP, ...) |
| `sdk` | Generated SDK composing client/core/server |
| `server` | Effect HttpApi server, routes, auth, event feed |
| `session-ui` | Session UI components (message, storybook, pierre) |
| `simulation` | Simulation backend/frontend/protocol/recording |
| `stories` | Playwright story harness |
| `theme` | Theme definitions (TUI) |
| `tui` | Terminal UI (OpenTUI + Solid) |
| `ui` | Shared UI components/design system |
| `util` | Shared utilities (paths, process, fetch, flock, ...) |

## services/
| Service | Kaam (verified) |
| --- | --- |
| `site` | Docs/marketing site (`@opencode/site`) |
| `data` | Data site deployment (`@opencode/data`) |
| `files` | File service (`@opencode/files`) |
| `legacy` | Legacy service (`@opencode/legacy`) |
| `update` | Update service (`@opencode/update`) |

## Key files (deep audit)
| Path | Kaam |
| --- | --- |
| `packages/cli/src/index.ts` | CLI bootstrap |
| `packages/cli/bin/opencode.cjs` | npm bin shim |
| `packages/cli/src/commands/commands.ts` | CLI command tree |
| `packages/cli/src/database-path.ts` | SQLite DB filename resolution |
| `packages/util/src/global.ts` | XDG global paths (`opencode` app name) |
| `packages/core/src/session/runner/llm.ts` | Session drain/turn loop |
| `packages/core/src/session/runner/step.ts` | One logical LLM step |
| `packages/core/src/session/execution.ts` | Process-local execution + recovery claim |
| `packages/core/src/session/prompt.ts` | Prompt admission |
| `packages/core/src/config/discovery.ts` | Config file discovery |
| `packages/core/src/provider.ts` | Provider loading |
| `packages/core/src/tool.ts` | Tool registry/execution |
| `packages/core/src/mcp/index.ts` | MCP integration |
| `packages/core/src/plugin/hooks.ts` | Plugin hook dispatch |
| `packages/plugin/src/effect/session.ts` | Session plugin hooks/types |
| `packages/server/src/routes.ts` | Server route composition |
| `packages/schema/src/config.ts` | Config schema root |
| `.github/workflows/check.yml` | CI lint + typecheck |
| `.github/workflows/release.yml` | Release pipeline |