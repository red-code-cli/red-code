# RedCode

**Ek advanced AI coding agent — terminal, web aur desktop ke liye.**

RedCode ek open-source AI development tool hai jo aapke codebase ko samajh kar plan
banata hai, files edit karta hai, commands chalata hai aur multi-step tasks complete
karta hai. Ye opencode ke MIT-licensed codebase (v2.3.0) par based hai aur isko
RedCode naam se aage develop kiya ja raha hai.

> Status: active development. Abhi koi published package/release nahi hai.

## Features

Audit me verify hui capabilities:

- **Terminal UI (TUI)** — OpenTUI + SolidJS par bana interactive terminal client.
- **Desktop app** — Electron-based app (`packages/desktop`).
- **Web app** — Vite + SolidJS UI (`packages/app`).
- **Agent loop** — durable sessions, inbox-driven execution, retries, compaction,
  background subagents.
- **Tools** — read/write/edit/patch, shell, grep/glob, webfetch/websearch, todo, skills,
  subagents, MCP tools/resources.
- **Providers** — multiple LLM provider adapters (`packages/ai`) aur model resolution.
- **MCP support** — stdio, OAuth, pooled connections.
- **Plugins** — Effect, Promise aur GUI plugin APIs with hooks.
- **Permissions** — configurable allow/ask/deny rules.
- **Config** — `redcode.json` / `redcode.jsonc`, project `.redcode/` aur global dirs.
- **Storage** — SQLite + Drizzle migrations.
- **Code Mode** — confined code execution over schema-described tools.
- **Server + SDK** — Effect HttpApi server, protocol package, generated SDK.
- **ACP** — Agent Client Protocol server support.

## Requirements

- **Bun 1.4.4** (declared package manager)
- Node.js 22+ (optional; Bun primary runtime hai)
- Git
- Rust toolchain (sirf `packages/process-daemon` build/test ke liye)

## Getting Started (development)

```bash
# 1. Dependencies
bun install

# 2. CLI + TUI (source se)
bun run dev

# 3. Web app
bun run dev:web

# 4. Desktop app
bun run dev:desktop
```

Useful checks:

```bash
bun run lint
bun run typecheck
bun run check
```

Tests package directory se chalayein (root se nahi):

```bash
cd packages/core && bun run test
```

## Project Structure

```
packages/
  ai/            LLM providers, model transport, LLM client
  app/           Vite + SolidJS web app
  cli/           CLI entry, commands, server connection
  client/        Server HTTP client
  codemode/      Confined code execution
  core/          Sessions, runner, tools, config, MCP, plugins, DB
  desktop/       Electron desktop app
  plugin/        Plugin SDK (Effect / Promise / GUI)
  protocol/      HTTP API contract
  schema/        Effect Schema definitions
  sdk/           Generated SDK
  server/        Effect HttpApi server
  session-ui/    Session UI components
  tui/           OpenTUI terminal UI
  ui/            Shared UI components
  util/          Shared utilities
services/        Site, data, files, legacy, update services
packages/data/   Data site (app / core / server)
.github/         CI/CD workflows and release assets
.redcode/memory/ Project memory and audit notes
```

## Roadmap

Coming soon.

## License

RedCode MIT License ke under released hai. `LICENSE` file as-is rakhi gayi hai, jisme
upstream copyright notice (Copyright (c) 2025 opencode) included hai. RedCode is an
independent project and is not affiliated with the upstream maintainers.