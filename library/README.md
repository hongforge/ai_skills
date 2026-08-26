# Library

This is the source of truth for reusable prompt cases.

| Path | Purpose |
| --- | --- |
| `taxonomy.yaml` | Stable, multi-dimensional category identifiers |
| `schema/case.md` | Required case metadata and publishing rules |
| `cases/` | One directory per reusable prompt |

Cases are physically grouped by collection only for readable URLs. Discovery
must use the taxonomy fields and tags inside each `case.yaml`, because a case
can belong to several deliverables and workflows at once.

## Publication lifecycle

`draft` → contributor supplied; not yet output-reviewed.

`verified` → reviewed on one or more named models, with a verification date.

`archived` → retained for historical reference but not recommended for new work.
