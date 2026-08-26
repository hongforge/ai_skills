# Open Image Prompt Library

[English](README.md) | [中文](README.zh.md)

[![CI](https://github.com/hongforge/ai_skills/actions/workflows/ci.yml/badge.svg)](https://github.com/hongforge/ai_skills/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-c5ff6f.svg)](LICENSE)
[![Cases](https://img.shields.io/badge/cases-123-755bff.svg)](library/cases)
[![Templates](https://img.shields.io/badge/templates-30-19856e.svg)](library/templates/catalog.yaml)

An original, structured library of reusable AI image prompts. It is built for people and agents who need prompts they can **find, adapt, evaluate, and contribute**.

> The repository ships 123 structured cases and 30 reusable prompt templates.

## Why this project

This project makes every case a small, reviewable production asset:

```
taxonomy + prompt + cover values + variables + evaluation status
```

The catalog is organized along five independent dimensions, so a user can find an e-commerce image-editing prompt, a Midjourney scene prompt, or a layout-focused infographic without forcing every case into one vague category.

| Dimension | Answers |
| --- | --- |
| Deliverable | What is being made: UI, product visual, infographic, poster, scene… |
| Medium | Photography, 3D render, vector graphic, illustration, mixed media |
| Workflow | Text-to-image, image-to-image, inpainting, compositing, series consistency |
| Capability | Text rendering, layout, fidelity, materials, spatial reasoning… |
| Model | Universal, GPT Image, Nano Banana, Midjourney, Stable Diffusion |

The stable identifiers are in [`library/taxonomy.yaml`](library/taxonomy.yaml).

## Explore the library

Starter cases show the expected range and format:

| Case | Deliverable | Workflow |
| --- | --- | --- |
| [Tea hero still life](library/cases/commerce/tea-hero-still-life) | Product commerce | Text to image |
| [Circular economy explainer](library/cases/design/circular-economy-explainer) | Infographic / educational visual | Text to image |
| [Sci-fi ecosystem scene](library/cases/education/sci-fi-ecosystem-scene) | Scene / illustration | Text to image |
| [Wardrobe recolor](library/cases/editing/wardrobe-recolor) | Portrait editing | Image to image / inpainting |

Each case has a `case.yaml` for search and automation and a human-readable `prompt.md`. Read the [case contract](library/schema/case.md) before adding a case.

## Reusable prompt templates

[`library/templates/catalog.yaml`](library/templates/catalog.yaml) adds 30 task-oriented prompt structures for UI, infographics, campaign posters, product commerce, brand systems, spaces, portraits, storyboards, teaching diagrams, product-development boards, and image editing. Each template includes:

```
replaceable variables + brief-resolution protocol + output contract + quality gates + risk controls + agent execution data
```

Templates are intentionally separate from examples: use a case to select a visual direction, then apply a template to make it repeatable in a real brief. See [`docs/template-system.md`](docs/template-system.md) for the design contract, selection rules, and review method.

## Browse locally

The included Vite gallery provides category counts, full-text search, model and workflow filters, generated cover previews, detailed quality metadata, and copyable templates.

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173` in a browser. The catalog is regenerated from `library/cases` and `library/templates` before each development build.

## Using a prompt

1. Find a case through its taxonomy and tags.
2. Replace `{{variables}}` with your brief.
3. Keep the limitations in mind; final copy and exact brand marks generally belong in a design tool.
4. If an entry is marked `verified`, use its tested-model record as evidence, not a universal guarantee.

## Agent-ready data and skills

The three assets are generated from one source directory rather than manually synchronized:

```
library/cases + library/templates
  → data/prompt-library.json (agents and automation)
  → site/src/catalog.generated.ts (website)
```

`data/prompt-library.json` is the stable machine-readable catalog. It includes every case and template together with taxonomy, cover values, variables, evaluation status, and limitations. The generator compiles each core visual direction into a production-ready prompt with required fields, output contract, structure, quality gates, and explicit constraints. `skills/open-image-prompt-library` lets Codex, Claude Code, Cursor, and similar agents select cases and pair them with a compatible template.

After installation, ask: `Use open-image-prompt-library to recommend a GPT Image case and template for a skincare product detail page.`

### Image-to-prompt skill

`skills/img2prompt` is a companion skill for reverse-engineering a reference image into a model-neutral visual specification, then rendering prompts for GPT, Nano Banana, Midjourney, or Stable Diffusion. It is intentionally separate from the library: it helps create and adapt cases, while this catalog stores reviewable reusable prompts.

```bash
npx skillport install ./skills/img2prompt --to claude,cursor,codex
```

## Contributing

Contributions must contain original prompts and original or project-generated preview assets. Every case must record its variables, evaluation status, and limitations.

Read [CONTRIBUTING.md](CONTRIBUTING.md), then run:

```bash
npm install
npm test
```

For project help and community expectations, see [Support](SUPPORT.md), [Governance](GOVERNANCE.md), [Security](SECURITY.md), and the [Code of Conduct](CODE_OF_CONDUCT.md). Release-level changes are recorded in [CHANGELOG.md](CHANGELOG.md).

## Project principles

- **Structured first.** Metadata is part of the content, not an afterthought.
- **Original content only.** Cases and previews must be created for this repository.
- **Model-aware, not model-locked.** Prefer universal prompts; document model-specific behavior.
- **Honest evaluation.** A verified result names when and where it was reviewed.
- **Respectful use.** No prompts based on living artists' names or facial reconstruction of identifiable private people.

## License

Repository code and documentation are [MIT](LICENSE).
