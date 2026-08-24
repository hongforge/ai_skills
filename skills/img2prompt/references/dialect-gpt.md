# 方言：GPT / ChatGPT 图像

## 口味

自然语言叙事段落。像给摄影师写 brief，不像填参数表。

- **长度**：80–150 词一段，最多两段。有余裕，无需激进截断
- **语序**：主体 → 环境与构图 → 光线 → 材质细节 → 整体调性
- **禁止**：`--ar` 之类参数语法、`(tag:1.2)` 权重语法、逗号堆砌的标签串
- **强项**：画面内文字渲染。`text_in_image` 有内容时，用引号明确写出，并单独成句强调
- **画幅**：写成自然语言（"a wide 16:9 frame"），不用参数

## salience 截断策略

长度充裕，通常无需丢弃。超出两段时，先丢 salience 3，再丢 salience 2 中的 `camera` 与 `style` 条目。**salience 1 永不丢弃。**

## IR 字段组 → 本方言表达

| IR 字段组 | 表达方式 |
|---|---|
| `subject` | 开篇主句，最具体的名词短语 |
| `composition` | 紧随主体的从句："framed at mid-shot, shot at eye level, subject placed right of center" |
| `lighting` | 独立句，写光位与光质："Warm key light rakes in from the upper left, throwing soft-edged shadows" |
| `palette` | 融进光线句或独立短句，色彩用描述性词而非十六进制 |
| `material` | 独立句写表面质感："Short matte fur catches a fine specular sheen at the tips" |
| `camera` | 收尾从句，`value` 为 null 时**整句省略**，不写占位 |
| `style` | 末句定调："The whole frame reads as clean commercial studio work" |
| `text_in_image` | 单独一句，文字加引号：`The word "SALE" appears in bold condensed sans across the lower third.` 无文字或 null 时整句省略 |
| `exclusions` | 末尾一句自然语言否定："No text, watermarks, or background clutter." |

## 模板

```
[subject 主句]，[composition 从句]。[lighting 句]。[material 句]。
[text_in_image 句（如有）]。[style 定调句]，[camera 从句（如有）]。
[exclusions 否定句]。
```

## 示例

以 `ir-schema.md` 中的柯基示例为输入：

> A corgi sits facing the camera with its mouth slightly open, framed as a mid-shot at eye level and placed just right of center against a large expanse of clean off-white negative space. A soft key light rakes in from the upper left at roughly 45 degrees, leaving shadow edges gentle and diffuse. Its short matte fur catches a fine specular sheen along the tips. The whole frame reads as clean commercial studio work with high finish and no heavy grading, shot with shallow depth of field so the backdrop falls slightly soft. No text, watermarks, collar, or background clutter.

注意 `camera` 的 `inferred` 条目（85mm / f2.8）被省略了 —— 它 salience 为 3，且自然语言里「shallow depth of field」已经承载了同一信息。**参数化的焦距在这个方言里是噪声。**
