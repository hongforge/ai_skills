# Contributing

Thank you for helping build a reliable, reusable AI image prompt library. We value original content, precise structure, and reviewable results over raw entry count.

## Choose a contribution

- Add or improve a structured prompt case.
- Add or improve an industrial prompt template.
- Correct taxonomy, validation, generated data, or documentation.
- Improve website accessibility, browsing, performance, or responsive behavior.
- Report a reproducible problem through the matching issue form.

Large taxonomy changes, schema changes, or new subsystems should begin with an issue so maintainers can review scope and migration impact.

## Local setup

```bash
npm install
npm run generate:catalog
npm test
npm run build
```

Node.js 20.19 or newer is required.

## Add a prompt case

1. Reuse identifiers from `library/taxonomy.yaml`.
2. Create `library/cases/<collection>/<case-id>/case.yaml` using `library/schema/case.md`.
3. Add `prompt.md` with a `## Prompt` section and clearly named variables such as `{{product_name}}`.
4. Fill every required field with concrete values matching the intended cover result.
5. Document limitations, evaluation status, tested models, and the last verification date when applicable.
6. Add only original or project-generated preview assets.
7. Regenerate the catalog and run the full validation commands.

## Add a template

Templates belong in `library/templates/catalog.yaml`. A production-ready template should define its use case, required variables, execution structure, output contract, quality checks, and common failure modes. Follow `docs/template-system.md` and avoid duplicating an existing template with cosmetic wording changes.

## Content quality

- Focus each case on one clear outcome.
- Use observable visual attributes rather than vague praise such as “premium” or “atmospheric.”
- Prefer model-neutral instructions unless a model-specific behavior is essential.
- Do not use living artists' names as style shortcuts.
- Do not request reconstruction of identifiable private individuals.
- Submit only prompts, previews, annotations, and documentation created specifically for this project.
- Never include API keys, private images, confidential briefs, or personal data.

## Verification states

New cases begin as `draft`. Mark a case `verified` only after reviewing its output on every model listed in `tested_models` and recording an ISO date in `last_verified`. Verification is evidence from a specific review, not a permanent guarantee across model updates.

## Pull requests

Keep pull requests focused. Explain the user need, summarize the implementation, link the related issue, and attach screenshots for website or preview changes. Reviewers may request changes for taxonomy consistency, prompt specificity, originality, accessibility, or generated-data stability.

By submitting a contribution, you confirm that it was created for this project and may be distributed under the repository license.
