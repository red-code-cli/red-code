# 07 — Permanent Rules

Ye rules har RedCode change par lagu hain. Inhe ignore mat karo.

## Core Rules
1. **Purana kuch na tute.** Koi existing feature bina wajah remove nahi karna.
2. **Clean, bug-free, readable code.** Minimal change, existing style follow karo.
3. **Har change se pehle memory files padho.** Change ke baad memory files update karo.
4. **Duplicate kaam/feature nahi.** Naya banane se pehle search karo — ho sakta hai pehle se ho.
5. **Secrets commit nahi.** `.env`, API keys, tokens, passwords kabhi commit mat karo.
   Commit se pehle `.gitignore` check + secret scan karo.
6. **LICENSE intact rahe.** `LICENSE` aur copyright notice ko mat chedo, mat hatao.

## Working Rules
7. **Audit-first:** Pehle padho, phir change karo. Jo verify nahi hua, uske baare me
   confidently mat likho — "Unknown" likho.
8. **Surgical changes:** Sirf task se related lines change karo; adjacent refactor nahi.
9. **Tests:** Root se test mat chalao. Package directory se chalao. Test pehle, phir fix.
10. **Generated files:** Generated client/schema/migrations haath se edit mat karo;
    codegen chalao (`bun run generate` from `packages/client` protocol changes par).
11. **Experimental first:** Naya behavior flag/experimental API ke peeche rakho.
12. **Branding ek saath:** RedCode rename karte waqt `04_BRANDING_MAP.md` ke saare
    touchpoints (config dirs, DB, env, desktop app id) ek plan me handle karo.
13. **Rollback possible rakho:** Har meaningful change se pehle git baseline commit.
14. **Memory update:** `08_CHANGELOG.md` me date + kya hua + affected files likho.

## Non-goals (abhi ke liye)
- Existing features ko bina reason remove/rename karna.
- Upstream license/attribution hatana.
- Secrets ya private legal drafts repo me daalna.