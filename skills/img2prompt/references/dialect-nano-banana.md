# 方言：Nano Banana / Gemini 图像

## 口味

自然语言，与 GPT 方言接近，但有一个决定性差异：**它擅长基于参考图的编辑指令**，所以本方言要出两种形态。

- **形态 A · 生成式**：与 GPT 方言同构的叙事段落，用于从零生成
- **形态 B · 编辑式**：用户手里有原图、只想改一部分时用。句式为「保留 X，把 Y 改成 Z」

`intent` 决定用哪个形态：`reproduce` → A；`restyle` → B；`style-extract` → A（主体泛化）。

- **长度**：形态 A 60–120 词；形态 B 越短越好，一到三句
- **强项**：指代明确的局部修改、多轮迭代
- **禁止**：参数语法、权重语法

## salience 截断策略

形态 A 与 GPT 方言一致：先丢 salience 3。

形态 B 特殊 —— **只保留「要改的部分」与 salience 1 的锚点条目**，其余全部省略。编辑指令里复述未改动的细节会让模型误以为那些也要重画。

## IR 字段组 → 本方言表达

| IR 字段组 | 形态 A（生成） | 形态 B（编辑） |
|---|---|---|
| `subject` | 开篇主句 | 作为锚点："keep the corgi exactly as is" |
| `composition` | 从句描述景别与机位 | 仅在需要改动时提及 |
| `lighting` | 独立句 | 改光时写 "relight it so that…" |
| `palette` | 描述性色彩短句 | 改色时写 "shift the palette toward…" |
| `material` | 表面质感句 | 改材质时写 "make the surface…" |
| `camera` | 收尾从句，null 时省略 | 几乎不用 |
| `style` | 末句定调 | `restyle` 的核心："render it in…" |
| `text_in_image` | 引号写出文字内容，无文字或 null 时省略 | 改字时写 "replace the text with …" |
| `exclusions` | 末句自然语言否定 | "don't add …" |

## 模板

形态 A：

```
[subject 主句]，[composition 从句]。[lighting 句]。[material 句]。
[text_in_image 句（如有）]。[style 定调句]。[exclusions 否定句]。
```

形态 B：

```
保留 [salience 1 锚点]。把 [目标] 改成 [style / palette / lighting 描述]。不要 [exclusions]。
```

## 示例

形态 A（柯基示例）：

> A corgi sitting square to the camera, mouth slightly open, mid-shot at eye level, offset right against a wide sweep of off-white seamless backdrop. Soft key light from the upper left, shadows falling gentle and diffuse. Short matte fur with a fine sheen along the tips. Clean commercial studio finish, backdrop softly out of focus. No text, watermark, collar, or clutter.

形态 B（`intent: restyle`，换成手绘调性）：

> Keep the corgi's pose and framing exactly as they are. Re-render it as a loose watercolor illustration — visible paper grain, soft bleeding edges, muted earth palette. Don't add text or a collar.

注意形态 B 完全没有复述光位和材质 —— 那些是 salience 2 的信息，在编辑语境里复述反而会干扰模型对「保留」的理解。
