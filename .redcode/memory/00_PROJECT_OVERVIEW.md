# 00 — Project Overview

## RedCode kya hai?
RedCode ek advanced AI coding agent project hai. Ye codebase original `opencode` ke
open-source code (v2.3.0) par based hai aur isi ko aage badha kar RedCode banaya jayega.

- **Current state (2026-11-14):** sirf audit + memory + README ka kaam hua hai.
- **Source code:** abhi tak koi change nahi kiya gaya. Ye audit-only snapshot hai.
- **Upstream:** `anomalyco/opencode` (CHANGELOG aur LICENSE se confirm).
- **License:** MIT, `LICENSE` file as-it-is hai (Copyright (c) 2025 opencode). Isko
  change ya remove nahi karna.

## Goal
opencode ke strong core (agent loop, tools, providers, sessions, server, TUI, desktop,
plugins, MCP) ko le kar RedCode naam se ek zyada advanced, stable aur apna product banana.
Pehla phase: codebase ko samajhna, safe extension points map karna, aur regression-free
tarike se aage badhna.

## Tech Stack (audit se verified)
| Area | Technology |
| --- | --- |
| Language | TypeScript (primary), Rust (`packages/process-daemon`), Bash (`install`) |
| Runtime | Bun 1.4.4 (declared `packageManager`), Node.js 26.x available locally |
| Package manager | Bun workspaces (`packages/*`, `packages/plugins/*`, `services/*`, `packages/data/*`) |
| Core library | Effect 4.x (`effect` catalog `4.1.0`) |
| UI | SolidJS, OpenTUI (`@opentui/*`), Electron (desktop), Vite |
| Server | Effect `HttpApi` / `HttpRouter` |
| Data | SQLite + Drizzle ORM (rc version), migrations in `packages/data/core/migrations` |
| Monorepo build | Turborepo 2.10.2 |
| Lint/format | oxlint, ast-grep, Prettier |
| Nix | `flake.nix`, `nix/` |
| CI/CD | GitHub Actions (`.github/workflows/`) |

## Repo Shape
- `packages/` — 35+ workspace packages (core, cli, server, ai, tui, app, desktop, ...)
- `packages/data/` — data site ke app/core/server (nested workspace)
- `services/` — site, data, files, legacy, update services
- `.github/` — workflows, release scripts, assets
- `nix/`, `flake.nix` — Nix packaging
- `install` — shell installer

## Important Note
Ye folder audit ke time **git repository nahi tha** (`git status` = "not a git
repository"). GitHub push ke liye repo pehle banana/initialize karna padega.