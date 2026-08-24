# ai_skills

[English](README.md) | [中文](README.zh.md)

**给 AI 编程 agent 用的工业级 skills。**

首发 `img2prompt`：丢一张图进去，拿回一段专业提示词 —— 适配 GPT、Nano Banana、Midjourney、Stable Diffusion。

## 它和「提示词大全」的区别

大多数图生提示词工具直接写一段文字碰运气。`img2prompt` 把这件事切成两段：

```
图片 → [解析为结构化规格] → IR → [按模型渲染] → 提示词
```

解析器**不知道你的目标模型是谁**。这正是关键：一个知道 Midjourney 喜欢短提示词的解析器，会悄悄不再细看材质和光位，于是四份输出开始互相打架。

两个元属性承担了主要工作：

- **`salience`（1–3）** —— 截断优先级。Midjourney 词预算紧张时，渲染器优先丢 salience 3，而不是从尾巴上随机砍。
- **`evidence`（observed / inferred）** —— 区分看到的和猜的。图糊就留 `null`，而不是编一个 `85mm f/1.4`。

`null` 只表示**无法判断**，不表示**确认不存在**。「这张图里没有文字」是一个观察结果，要写出来 —— 两者混用会让渲染器无从判断该保守还是该放心省略。

加第五个模型 = 加一份方言表，解析器一行不动。

## 安装

```bash
npx skillport install ./skills/img2prompt --to claude,cursor,codex
```

无需 API key，零运行时依赖。skill 本体就是纯 Markdown。

## 使用

给 agent 一张图，说清楚你要什么：

- 「复现这张图」→ `intent: reproduce`
- 「保持这个调性，换个主体」→ `intent: restyle`
- 「只要这个风格」→ `intent: style-extract`

它会返回 IR，以及你指定的方言提示词。

## 内容红线

两条硬规则，写死在 `references/policy.md`：

1. **不点名在世艺术家。** 风格用视觉属性描述 —— 厚涂笔触、高饱和补色对撞、粗黑轮廓线。这同时也是更稳的选择：不同模型对同一个艺术家名字的理解天差地别，对「厚涂笔触」的理解则高度一致。
2. **可辨识的真实私人不做面部特征重建。** 主体降级为泛化描述。

## 测试

```bash
npm test
```

两层免费跑在 CI 里：结构校验（每份方言表必须覆盖全部 9 个 IR 字段组）与金标准 IR 的 schema 校验。行为回归需要调用模型，保持可选 —— 混进 CI 会让 PR 的成败取决于运气。

## 当前状态

6 个 showcase 案例已建骨架，状态为 `pending`。原图、金标准 IR 与复现图在后续一轮补齐；案例一旦翻成 `complete`，测试会立刻开始校验这些产物。

## 许可证

MIT
