# 05 — Extension Points

> Rule: naya feature pehle **plugin/config/extension** layer me daalo. Core ke critical
> files (session runner, execution, migrations) sirf tab chedna jab extension possible na ho.

## 1) Plugins (sabse safe)
- SDK: `packages/plugin/src/effect/` (primary), `packages/plugin/src/promise/` (promise API),
  `packages/plugin/src/gui/` (GUI plugins).
- Registration/service: `packages/core/src/plugin/{service,host,module,hooks}.ts`.
- Hook domains (verified in `packages/plugin/src/effect/session.ts` + `hooks.ts`):
  - `aisdk`
  - `session`: `fork`, `prompt`, `context`, `compaction`, `generate`, `title`,
    `experimental.model.resolve`, `model.request`, `http.request`, `http.response`,
    `experimental.ws.handshake`, `experimental.ws.send`, `experimental.ws.receive`,
    `retry`, `experimental.idle`
  - `permission`
  - `shell`
  - `tool`: `execute.before`, `execute.after`
- Config entry: `plugins` in `opencode.json`; plugin loading async hoti hai (see `AGENTS.md`).

## 2) Tools
- Runtime: `packages/core/src/tool.ts`, `packages/core/src/tool/runtime.ts`.
- Built-in tools: `packages/core/src/tool/plugin/*.ts` (read, write, edit, patch, shell,
  grep, glob, webfetch, websearch, todo, skill, subagent, question, schedule, image-generate...).
- Naya tool add karne ke safe tarike:
  1. Plugin ke `ToolEditor` se register karo (`packages/plugin/src/effect/tool.ts`).
  2. Ya built-in pattern follow karke `tool/plugin/<name>.ts` add karo + registration.
- Permission rules: `packages/core/src/permission.ts`.

## 3) Providers / Models
- Provider adapters: `packages/ai/src/providers/` (alibaba, anthropic, azure, bedrock, ...).
- Provider loader/builtins: `packages/core/src/provider.ts`.
- Model resolution: `packages/core/src/model-resolver.ts`, `model.ts`.
- Config: `providers` key in `packages/schema/src/config/provider.ts` + `config.ts`.
- Safe: naya provider adapter add karo, core runner ko touch kiye bina.

## 4) Agents / Commands / Skills
- Built-in agent default `build`: `packages/core/src/agent.ts`.
- Config schemas: `packages/schema/src/config/{agent,command}.ts`, `packages/schema/src/skill.ts`.
- File-based: `.opencode/agent/*.md`, `.opencode/command/*.md`, `.opencode/skills/*`
  (ye repo khud isi pattern ka use karta hai).
- Instructions: `instructions` config + `packages/core/src/instruction-discovery.ts`.

## 5) MCP
- Config: `mcp` key (`packages/schema/src/config/mcp.ts`).
- Core: `packages/core/src/mcp/{client,connection,oauth,stdio,pool}.ts`.
- MCP tools/resources: `packages/core/src/tool/mcp.ts`, `tool/plugin/mcp-resource.ts`.
- Experimental MCP events: `tool/plugin/mcp-events.ts` + `mcp_events` flag.

## 6) GUI / Desktop / Web
- GUI plugin runtime: `packages/gui-plugins/src/`, SDK `packages/plugin/src/gui/`.
- Shared UI: `packages/ui/src/`, session UI: `packages/session-ui/src/`.
- Web app: `packages/app/src/{home,composer,session,settings,...}`.
- Desktop: `packages/desktop/src/{main,preload,renderer}`; browser plugin
  `packages/plugin-browser/`.
- Safe: naya panel/command/action GUI plugin ke through add karo.

## 7) TUI
- Feature plugins: `packages/tui/src/feature-plugins/`.
- Stories: `packages/tui/src/feature-plugins/system/storybook/` (repo rule: real
  production component render karo, visual copy nahi).
- Themes: `packages/theme/src/tui/`, tokens TUI context (`packages/tui/src/context/theme.tsx`).
- New routes/components: `packages/tui/src/{routes,component,context}`.

## 8) Server / API / SDK
- API contract: `packages/protocol/src/{api,groups,client}.ts`.
- Server routes/handlers: `packages/server/src/{routes,api,handlers}.ts`.
- SDK generated: `packages/sdk` + `packages/client` codegen.
- Rule: protocol/HttpApi change ke baad `bun run generate` from `packages/client`; generated
  files manually edit mat karo.
- New endpoints experimental (`/api/experimental/<group>/...`) se start karo.

## 9) Code Mode / Automation
- `packages/codemode/` — schema-described tools par confined JS execution.
- `packages/core/src/codemode/` — catalog/tool integration.
- Safe: naye automation tools Code Mode catalog me expose karo.

## 10) Feature flags
- Flag definitions: `packages/schema/src/config/flag.ts`.
- Read: `Flag.enabled("<key>")` from `@opencode/core/flag`.
- Naya risky feature flag ke peeche rakho; ship hone par flag delete karo.

## Avoid (extension ke bajaye core edit)
- `session/runner/*`, `session/execution.ts`, `session/inbox.ts` (agent loop semantics)
- `database/migrations`, `schema.gen.ts`
- `server/routes.ts` + protocol (generated SDK impact)
- `config/discovery.ts` (config precedence)
- `.github/release/**` (release security boundary)