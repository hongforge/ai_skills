---
name: img2prompt
description: Use when the user provides an image and wants a prompt from it — to recreate it, restyle it, or borrow its look. Reverse-engineers the image into a structured visual spec, then renders that spec into the prompt dialect of the target image model.
---

# img2prompt

把图片逆向为可直接投喂给图像模型的专业提示词。

## 两段式流程

**Stage 1 解析时，不得考虑目标模型是谁。**

这是本 skill 的架构红线。一旦解析阶段知道目标模型偏好短提示词，它会主动省略材质、光位等细节，跨模型一致性随即崩塌。解析必须无条件抽取全量信息，**取舍只发生在 Stage 2**。

```
图片 → [Stage 1: 抽取 IR] → IR → [Stage 2: 渲染方言] → 提示词
```

## Stage 1：抽取 IR

### 1. 确认 intent

问用户，或从其措辞推断：

| intent | 用户想要 | 解析侧重 |
|---|---|---|
| `reproduce` | 复现这张图 | 主体细节最大化 |
| `restyle` | 换个主体，保持这个调性 | 弱化 subject，放大 style / lighting / palette |
| `style-extract` | 只要这个风格 | subject 降为泛化占位 |

默认 `reproduce`。

### 2. 评估 legibility

图片模糊、过小、严重压缩时记为 `medium` 或 `low`。这个值决定你允许留多少空白 —— **它是诚实的许可，不是降低标准的借口**。

### 3. 逐组填写 9 个内容字段组

`subject` `composition` `lighting` `palette` `material` `camera` `style` `text_in_image` `exclusions`

字段定义与填写规范见 `references/ir-schema.md`。**逐组走一遍，不要跳组** —— 跳过的组是后续所有方言共同的信息缺口。

### 4. 遵守内容红线

见 `references/policy.md`。两条硬规则，无例外。

### 5. 输出 IR

以 YAML 输出，供用户核对与复用。

## Stage 2：渲染方言

按目标读取对应方言表，全部位于 `references/`：

| 目标 | 方言表 |
|---|---|
| GPT / ChatGPT 图像 | `references/dialect-gpt.md` |
| Nano Banana / Gemini 图像 | `references/dialect-nano-banana.md` |
| Midjourney | `references/dialect-midjourney.md` |
| Stable Diffusion / SDXL / ComfyUI | `references/dialect-sd.md` |

用户未指定目标时，问一次；用户说「都要」则四份全出。

**遇到长度上限时，按 `salience` 从 3 向 1 依次丢弃条目。** 不要从末尾截断 —— 那是随机破坏信息。

## 反模式

| 做法 | 为什么错 |
|---|---|
| 先问「目标模型是哪个」再看图 | 违反架构红线，解析会为特定模型偷懒 |
| 图糊看不清镜头，仍写「85mm f/1.4」 | 编造。应留 null 并标 `evidence: inferred` |
| 用 null 表示「画面里没有文字」 | null 只表示「无法判断」。确认不存在要写成文字并标 `observed` |
| 直接写成一段提示词，跳过 IR | 跨模型输出会不一致，且无法复用与核对 |
| 用「参考某艺术家风格」概括画风 | 违反内容红线，且跨模型稳定性更差 |
