# RedCode — Contributing Guide

RedCode ek open-source project hai. Agar aap contribute karna chahte ho, to ye guide read karein.

## Setup

```bash
# Clone aur install
git clone https://github.com/red-code-cli/red-code.git
cd red-code
bun install

# Development TUI
bun run dev

# Web UI
bun run dev:web

# Desktop
bun run dev:desktop
```

## Code Standards

- **Language:** TypeScript (strict mode)
- **Style:** `bun run lint` aur `bun run check` chalayein before commit
- **Package Manager:** Bun (Node 22+ fallback)
- **Tests:** Package directories se chalayein, root se nahi
  ```bash
  cd packages/core && bun run test
  ```

## Commit Messages

Conventional commits follow karein:

```
feat(scope): short description
fix(scope): short description
docs: short description
chore(scope): short description
refactor: short description
test: short description
```

Examples:
- `feat(tui): add command palette`
- `fix(core): handle concurrent sessions`
- `docs: update README`

## Branch Names

Short, descriptive, hyphen-separated:

```
session-recovery
fix-scroll-state
regenerate-sdk
```

NOT:
- `feature/name` (no slashes)
- `feat-` prefix (unnecessary)

## Pull Requests

1. Base branch: `dev` (default)
2. Title: `type(scope): summary` (under 70 chars)
3. Description: What changed, why, and what was tested
4. GitHub Actions check pass hona zaroori hai
5. At least 1 review before merge

Example PR title:
```
feat(app): add dark mode toggle
```

## Project Structure

Main directories:

```
packages/
  core/       Sessions, tools, config, DB
  app/        Web UI (Vite + SolidJS)
  tui/        Terminal UI
  desktop/    Electron desktop
  cli/        CLI commands
  server/     HTTP API server
  
services/
  site/       Marketing website
  data/       Data service
  
.redcode/
  memory/     Project documentation
  skills/     Agent skills
```

## Important Guidelines

### Do NOT:
- Change LICENSE or CHANGELOG directly
- Rename service URLs or provider IDs
- Edit generated files (e.g., `packages/nav-menus/src/brand.ts`)
- Run tests from repository root (use package directories)
- Use `any` type in TypeScript
- Star imports (`import * as X`)

### DO:
- Use `bun run check` for full lint + typecheck
- Write tests alongside code
- Use Bun APIs when available
- Prefer functional array methods
- Keep commits focused and small
- Update related documentation

## Questions?

- File an issue on GitHub
- Check `.redcode/memory/` for project docs
- Ask in discussions

## License

By contributing, aap agree karte ho ki aapka code MIT License ke under released hoga.

Happy coding! 🚀
