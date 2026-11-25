# 06 — Risks & Don't Touch

## Top Risks (audit observations)
1. **Git history missing:** audit time par folder git repo nahi tha. Koi change karne se
   pehle `git init` + baseline commit zaroori hai, warna rollback/compare possible nahi.
2. **LICENSE / copyright:** `LICENSE` me `Copyright (c) 2025 opencode` hai. MIT license
   notice ko remove/rename karna legal risk hai. **As-is rakho.**
3. **Bleeding-edge dependencies:** `effect@4.1.0`, `drizzle-orm@1.0.0-rc`, TypeScript
   7.1 beta (`@typescript/native`), `@opentui/*@0.8.4`, Bun 1.4.4. Inke upgrade se
   compile/runtime break expected hai; upgrade alag branch me + full `check` ke saath.
4. **Rebranding blast radius:** app name/config dirs/DB filename/env prefix/desktop app id
   har jagah embedded hain. Adhoora rename config, sessions, updates, deep links tod dega.
   Pehle `04_BRANDING_MAP.md` ke saath ek migration plan banao.
5. **Session core delicacy:** `session/execution.ts` write-ahead claim, inbox delivery,
   retry/compaction, restart recovery — inme chhoti galti data loss/duplicate turns de
   sakti hai. Sirf tests + design ke saath change karo.
6. **Generated / contract files:** `schema.gen.ts`, `migration.gen.ts`, protocol/SDK
   generated client. Haath se edit karne par codegen aur CI tootegi.
7. **Release pipeline secrets:** `.github/release/**` AWS/OIDC/R2/Azure signing use karta
   hai. Isse change karna high-risk; local se release reproduce nahi hoga.
8. **179 MB / 11,433 files:** mobile storage (`/storage/emulated/0`) par git operations
   slow ho sakte hain. Full-source GitHub push MCP ke liye bhi bhaari hai.
9. **Secrets:** `.gitignore` me `.env`, `.env.local` ignored hain, `.gitleaksignore` bhi
   maujood hai. Commit se pehle secret scan karo (`run_secret_scanning`).
10. **Build not verified:** `node_modules` missing tha; install/build/test audit me run
    nahi hue. CI par hi real verification hogi.
11. **Upstream CI `dev` branch maanta hai:** RedCode repo ka default branch `main` hai,
    lekin inherited workflows (jaise `triage-pr-standards.yml`) `.github/TEAM_MEMBERS` ko
    `ref: dev` se padhte hain. Isliye PR par `check-standards` fail hota hai. Workflows ko
    RedCode ke branch model ke hisaab se baad me align karna hoga (abhi source untouched).

## Tech Debt / Weak Areas (observation only)
- Root `test` script jaan-boojh kar fail karta hai; tests package-wise chalte hain.
- `packages/identity/` sirf assets hai (no code).
- `packages/data/` root me `package.json` nahi (nested app/core/server workspaces hain).
- Bahut saare `experimental.*` flags/endpoints — inka surface bada aur changing hai.
- Upstream `AGENTS.md` aur docs abhi opencode branding ke saath hain (audit me change nahi).
- README translations (`README.*.md`) opencode branding rakhte hain (as-is chhode gaye).
- TS test files nahi mile: `effect-drizzle-sqlite`, `identity`, `plugins`, `process-daemon`
  (Rust tests ho sakte hain), `stories` (harness), `nav-menus`, `theme`. Coverage measured
  nahi — sirf file count observation.

## Don't Touch (fragile / critical)
| Path | Kyun |
| --- | --- |
| `LICENSE` | Legal copyright notice |
| `.github/release/**`, `.github/workflows/release.yml` | Signing/publishing security boundary |
| `packages/core/src/session/runner/**` | Agent loop, retry, compaction, provider calls |
| `packages/core/src/session/{execution,inbox,run-coordinator}.ts` | Durability, concurrency, recovery |
| `packages/core/src/database/{schema.gen.ts,migration.gen.ts}` | Generated schema/migrations |
| `packages/data/core/migrations/**` | Applied DB migrations |
| `packages/protocol/src/**` | API contract; generated SDK depends on it |
| `packages/sdk` generated files | Codegen output |
| `packages/core/src/config/discovery.ts` | Config precedence; users ke setup ko tod sakta hai |
| `packages/desktop/electron-builder.config.ts` (app IDs/scheme) | Installed apps, updates, deep links |
| `packages/cli/package.json` (`bin`) | Published command names |
| `packages/process-daemon` protocol | PTY IPC protocol compatibility |
| `.gitignore` / `.gitleaksignore` | Secrets safety |
| `AGENTS.md`, `CHANGELOG.md` | Upstream source of truth (read-only reference) |

## Change Karne Se Pehle Checklist
- [ ] `.redcode/memory/` padha
- [ ] `git init` + clean baseline commit
- [ ] `bun install` + `bun run check`
- [ ] Affected package ke tests chalaye
- [ ] Secret scan (commit se pehle)
- [ ] LICENSE intact
- [ ] Memory files update