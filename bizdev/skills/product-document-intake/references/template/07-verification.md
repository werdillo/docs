# 07 — Verification (technical half, optional)

*Maps every business rule (section 9) and *What if* row (section 8) to tests,
guards and release checklists.*

## Rules and edge cases → tests

| Rule / *What if* | Behaviour proven | Test tier |
|---|---|---|
| R1 | | *unit · database · browser · live · simulation* |

## Guards enabled

*Which automated architectural, UI, site or tidy guards run on every check.*

## Demo and pilot readiness checklist

- [ ] *First slice runs end to end on real devices*
- [ ] *Duplicate submit and stale-data refusals proven*
- [ ] *Backup/restore and failure fallback verified*
