# 03 — Commands

> **Verification note:** Neeche ke commands `package.json` / package scripts se liye gaye
> hain. Audit ke dauraan sirf `bun --version`, `node --version`, `git --version` aur
> directory/read commands chalaye gaye. Install/build/test **execute nahi kiye gaye**
> (node_modules bhi maujood nahi tha). Jo command run karke verify nahi hui, use "script
> defined (not executed)" samjhein.

## Environment (verified by running)
```bash
bun --version     # 1.4.4
node --version    # v26.12.1
git --version     # 2.56.0
```
- `packageManager`: `bun@1.4.4` (`package.json`)
- `node_modules/`: audit time par maujood nahi tha

## Install
```bash
bun install
```
- `postinstall` chalta hai: `bun run --cwd packages/core fix-node-pty`
- `bunfig.toml` me `minimumReleaseAge = 259200` (3 din) set hai.

## Run / Dev (script defined, not executed)
```bash
bun run dev             # CLI + TUI (packages/cli/src/index.ts)
bun run dev:live        # installed opencode background server se connect
bun run dev:desktop     # Electron desktop
bun run dev:web         # web app (packages/app)
bun run dev:site        # docs site (services/site)
```

## Build / Pack (script defined, not executed)
```bash
bun run pack                          # repo pack script
bun run --cwd packages/cli build      # CLI build
bun run --cwd packages/cli build:node # Node build
bun run --cwd packages/desktop build  # Desktop build
bun run --cwd packages/app build      # Web build
```

## Lint / Typecheck (script defined, not executed)
```bash
bun run lint            # oxlint + ast-grep + sdk docs + greys check
bun run lint:changed    # changed files lint
bun run typecheck       # turbo typecheck (bun check per package)
bun run typecheck:tsc   # official TypeScript (CI source of truth)
bun run check           # lint + typecheck
```

## Tests
Root se test chalana **mana** hai (`bun test` root me intentionally fail hota hai:
`"do not run tests from root"`). Package directory se chalao:
```bash
cd packages/core     && bun run test
cd packages/server   && bun run test
cd packages/cli      && bun run test
cd packages/tui      && bun run test
cd packages/app      && bun run test        # unit + browser
cd packages/desktop  && bun run test
cd packages/ui       && bun run test
cd packages/client   && bun run test
cd packages/sdk      && bun run test
```
- `packages/app` e2e: `bun run test:e2e` (Playwright)
- `packages/app` components: `bun run test:components`
- Audit me total test files: **1721** (`*.test.ts` / `*.test.tsx` / `*.spec.ts`), jisme
  `packages/app` 336, `packages/core` 322, `packages/tui` 197, `packages/ai` 167.

## Data site (script defined, not executed)
```bash
bun run --cwd packages/data/app dev
bun run --cwd packages/data/app typecheck
bun run --cwd packages/data/core typecheck
bun run --cwd packages/data/server typecheck
```

## CLI commands (from `packages/cli/src/commands/commands.ts`)
`upgrade`, `uninstall`, `acp`, `api`, `debug {agents,config,heap-dump,paths}`,
`auth {list,login,logout,export,import,switch}`, `mcp {list,add,auth,logout}`,
`plugin {list,add,check,update,remove}`, `models`, `stats`, `mini`, `run`, `session
{list,delete,export,import}`, `service {start,restart,status,stop,get,set,unset}`,
`reload`, `pair`, `serve`.

## Nix (defined, not executed)
```bash
nix develop
nix run github:anomalyco/opencode   # upstream README se
```

## Rebrand ke baad (RedCode)
```bash
# dev
bun install
bun run dev                     # CLI/TUI dev (packages/cli)
bun run dev:live                # live server ke against (redcode service status/get password)
bun run check                   # lint + typecheck

# npm se install (GitHub Actions me publish hone ke baad)
npm install -g redcode-ai       # `redcode` command
# ya installer
curl -fsSL https://raw.githubusercontent.com/Vempire-X/RedCode/main/install | bash

# release (GitHub Actions)
git tag v0.1.0 && git push origin v0.1.0   # .github/workflows/redcode-release.yml trigger
```
- Env vars ab `REDCODE_*` (pehle `OPENCODE_*`): e.g. `REDCODE_CONFIG`, `REDCODE_DB`, `REDCODE_BIN_PATH`,
  `REDCODE_CHANNEL`, `REDCODE_VERSION`.
- Config: `~/.config/redcode/redcode.json(c)`, project `.redcode/redcode.json(c)`, DB `redcode.db`.
- **Note:** inme se koi command yahan execute nahi hui (local build possible nahi). Sab CI par unverified.

