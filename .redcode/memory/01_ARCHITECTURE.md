# 01 — Architecture

## High-level layers
```
CLI / TUI / Desktop / Web
        │  (HTTP + event stream; SDK/client)
        ▼
packages/server  (Effect HttpApi routes, auth, SSE/event feed)
        │
        ▼
packages/core    (sessions, runner, tools, permissions, config, MCP, plugins, DB)
        │
        ├── packages/ai       (providers, model transport, LLM client)
        ├── packages/schema   (Effect Schema: config, events, models, protocol shapes)
        └── SQLite (Drizzle)  (sessions, messages, blobs, inbox, state)
```

## Entry points
| Entry | Path | Kaam |
| --- | --- | --- |
| CLI source | `packages/cli/src/index.ts` | Bun entry. Plugin runtime ensure, command handlers register, `Runtime.run(Commands, Handlers)` |
| npm bin shim | `packages/cli/bin/opencode.cjs` | `opencode` / `opencode2` command ko platform binary (`@opencode/cli-<os>-<arch>`) par forward karta hai |
| Command spec | `packages/cli/src/commands/commands.ts` | Saare CLI commands/flags ka Effect CLI definition |
| Server | `packages/cli/src/commands/handlers/serve.ts` + `packages/server/src/routes.ts` | HTTP server start |
| TUI | `packages/tui/src/` | OpenTUI + Solid terminal UI |
| Web app | `packages/app/src/` | Vite + Solid web UI |
| Desktop | `packages/desktop/src/main/` | Electron main process + app window |

## Request / data flow (user input → output)
1. User prompt CLI/TUI/Desktop/Web se aata hai.
2. Client server API call karta hai; `packages/core/src/session/prompt.ts` prompt admit karta hai.
3. Durable event `session.inbox.enqueued` publish hota hai; projection `session_inbox` row insert karta hai.
4. `SessionExecution.wake(sessionID)` execution schedule karta hai (`packages/core/src/session/execution.ts`).
5. `SessionRunner.drain` (`session/runner/llm.ts`) inbox se next promotable item leta hai.
6. `SessionStep.attempt` (`session/runner/step.ts`) ek logical LLM call karta hai:
   - history/context build (`session/history.ts`, `session/context.ts`)
   - provider/model resolve (`model-resolver.ts`, `provider.ts`)
   - `LLMClient` se stream (`packages/ai`)
   - tool calls execute (`tool.ts` + `tool/plugin/*`) with permission checks (`permission.ts`)
   - messages/parts SQLite me persist (`session/message.ts`, `session/sql.ts`)
   - `Bus` par events publish (`bus.ts`, `session/event.ts`)
7. Server event feed clients ko events bhejta hai (`packages/server/src/event-feed.ts`).
8. TUI/Web/Desktop render karte hain; next step ya idle.

## Core modules (paths)
- **Agent loop:** `packages/core/src/session/runner/{llm,step,retry,model,to-llm-message}.ts`
- **Session lifecycle:** `session/{session,execution,run-coordinator,inbox,message,compaction,history,store}.ts`
- **Tools:** `packages/core/src/tool.ts` + `tool/plugin/{read,write,edit,patch,shell,grep,glob,webfetch,websearch,todo,skill,subagent,...}.ts`
- **Providers/models:** `packages/core/src/provider.ts`, `model.ts`, `model-resolver.ts`, `packages/ai/src/`
- **Config:** `packages/core/src/config.ts`, `config/discovery.ts`, `config/{normalize,watch,variable}.ts`
- **Permissions:** `packages/core/src/permission.ts`, `permission/saved.ts`
- **MCP:** `packages/core/src/mcp/{client,connection,oauth,stdio,pool}.ts`
- **Plugins:** `packages/core/src/plugin/*`, SDK `packages/plugin/src/{effect,promise,gui}/`
- **Server/API:** `packages/server/src/{routes,api,handlers,event-feed,auth}.ts`, `packages/protocol/src/`
- **TUI:** `packages/tui/src/{component,context,routes,prompt,feature-plugins}/`
- **Desktop:** `packages/desktop/src/{main,preload,renderer}/`
- **Code Mode:** `packages/codemode/src/`, `packages/core/src/codemode/`

## Config & storage
- **Config files:** `opencode.json` / `opencode.jsonc` (`core/src/config/discovery.ts`), project `.opencode/`, plus global/system dirs.
- **Global paths:** `packages/util/src/global.ts` + `global-roots.ts` (XDG based):
  - data: `~/.local/share/opencode`
  - cache: `~/.cache/opencode`
  - config: `~/.config/opencode`
  - state: `~/.local/state/opencode`
  - tmp: `<tmp>/opencode`
- **Database:** SQLite file `opencode.db` (channel-specific name possible), `packages/cli/src/database-path.ts`.
- **Migrations:** `packages/data/core/migrations/`, applied via `packages/core/src/database/migration.ts`.
- **Session data:** messages/parts/blobs/inbox tables (`core/src/session/sql.ts`, `sql` + `blob.ts`).

## Server model
- Server Effect `HttpApi` par bana hai; routes `packages/server/src/routes.ts` me compose hote hain.
- Server background service ke roop me chal sakta hai; CLI `ServerConnection.resolve()` usse connect karta hai (`packages/cli/src/services/server-connection.ts`).
- `serve` command private server bhi chala sakta hai (`--standalone`).