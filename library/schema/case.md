# Case contract

Every published prompt lives in its own directory under `library/cases/` and
contains a `case.yaml` plus a `prompt.md`. The test suite validates the YAML
contract; this document explains the fields so people can contribute without
reading TypeScript.

```yaml
id: tea-hero-still-life                 # globally unique, lowercase kebab-case
title: Tea hero still life              # short, descriptive title
summary: One-sentence description
taxonomy:
  deliverable: [product-commerce]       # one or more IDs from taxonomy.yaml
  medium: [photography]
  workflow: [text-to-image]
  capability: [product-fidelity, material-lighting]
  model: [universal, gpt-image]
tags: [tea, studio, advertising]        # 3–8 search terms
license:
  prompt: CC0-1.0                       # required for reuse
  reference: none                       # repository-original content only
source:
  kind: original                         # repository-original content only
  url: null
  rights_note: Original repository content.
prompt:
  language: en
  variables: [product_name, hero_color] # variables must use snake_case
evaluation:
  status: draft                          # draft, verified, or archived
  tested_models: []                      # model IDs where output was reviewed
  last_verified: null                    # YYYY-MM-DD for verified entries
  limitations: []
```

`prompt.md` must include a `## Prompt` heading. Cases are deliberately
model-agnostic by default; model-specific variants belong in separate Markdown
sections and should retain the same variable names.

Only include prompt text, images, annotations, and documentation created specifically for this project.
