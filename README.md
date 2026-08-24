# ai_skills

[English](README.md) | [中文](README.zh.md)

**Industrial-grade skills for AI coding agents.**

Ships `img2prompt`: hand it an image, get a professional prompt back — for GPT, Nano Banana, Midjourney, or Stable Diffusion.

## Why this is not another prompt dump

Most image-to-prompt tools write one blob of text and hope it lands. `img2prompt` splits the job in two:

```
image → [parse into a structured spec] → IR → [render per model] → prompt
```

The parser **never knows which model you are targeting**. That is the whole point: a parser that knows Midjourney wants short prompts will quietly stop looking at material and lighting, and your four outputs stop agreeing with each other.

Two metadata attributes carry the weight:

- **`salience` (1–3)** — truncation priority. Midjourney has a tight word budget; the renderer drops salience 3 first instead of cutting off the tail at random.
- **`evidence` (observed / inferred)** — what was seen versus what was guessed. A blurry photo yields `null`, not a fabricated `85mm f/1.4`.

`null` means *could not tell*, never *confirmed absent*. "There is no text in this image" is an observation and gets written out as one — collapsing the two would leave the renderers unable to decide whether to hedge or to safely omit.

Adding a fifth model means adding one dialect file. The parser does not change.

## Install

```bash
npx skillport install ./skills/img2prompt --to claude,cursor,codex
```

No API key. No runtime dependencies. The skill is plain Markdown.

## Use

Give your agent an image and say what you want:

- "recreate this" → `intent: reproduce`
- "same look, different subject" → `intent: restyle`
- "just the style" → `intent: style-extract`

It returns the IR plus prompts in whichever dialects you asked for.

## Content policy

Two hard rules, enforced in `references/policy.md`:

1. **No naming living artists.** Style is described by visual attributes — impasto brushwork, high-saturation complementary clashes, heavy black outlines. This is also the more portable choice: models disagree wildly about what an artist's name means and agree closely about what impasto means.
2. **No facial reconstruction of identifiable private individuals.** The subject degrades to a general description.

## Tests

```bash
npm test
```

Two layers run free in CI: structural checks (every dialect file covers all nine IR field groups) and schema validation of the golden IR files. Behavioral regression needs a model and stays opt-in — mixing it into CI would make pull requests pass or fail on luck.

## Status

The six showcase cases are scaffolded and marked `pending`. Their source images, golden IR, and recreated outputs land in a follow-up round; the case tests start enforcing those artifacts the moment a case flips to `complete`.

## License

MIT
