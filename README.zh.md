# Open Image Prompt Library

[English](README.md) | [中文](README.zh.md)

[![持续集成](https://github.com/hongforge/ai_skills/actions/workflows/ci.yml/badge.svg)](https://github.com/hongforge/ai_skills/actions/workflows/ci.yml)
[![MIT 许可证](https://img.shields.io/badge/License-MIT-c5ff6f.svg)](LICENSE)
[![案例数量](https://img.shields.io/badge/cases-123-755bff.svg)](library/cases)
[![模板数量](https://img.shields.io/badge/templates-30-19856e.svg)](library/templates/catalog.yaml)

一个原创、可检索、可验证的 AI 图像提示词库，让每一个条目都可以被**查找、改写、评估和贡献**。

> 仓库现有 123 个结构化案例与 30 套可复用提示词模板。

## 为什么要做它

本项目将每个案例做成可审阅、可直接使用的生产资产：

```
分类 + 提示词 + 封面值 + 变量 + 验证状态
```

案例通过五个彼此独立的维度分类。你可以找到“电商 + 图片编辑”的案例，也可以按 Midjourney、信息图或版式控制来找，不再被单一、模糊的分类限制。

| 维度 | 回答的问题 |
| --- | --- |
| 成品类型 | 要做什么：UI、商品视觉、信息图、海报、场景等 |
| 视觉媒介 | 摄影、3D 渲染、矢量图形、插画、混合媒介 |
| 工作流 | 文生图、图生图、局部重绘、合成、系列一致性 |
| 能力重点 | 文字渲染、版式、保真度、材质、空间推理等 |
| 模型方言 | 通用、GPT Image、Nano Banana、Midjourney、Stable Diffusion |

全部稳定分类 ID 见 [`library/taxonomy.yaml`](library/taxonomy.yaml)。

## 浏览内容库

首批案例展示了预期的覆盖面和文件格式：

| 案例 | 成品类型 | 工作流 |
| --- | --- | --- |
| [茶饮主视觉](library/cases/commerce/tea-hero-still-life) | 商品电商 | 文生图 |
| [循环经济信息图](library/cases/design/circular-economy-explainer) | 信息图 / 教育视觉 | 文生图 |
| [科幻生态场景](library/cases/education/sci-fi-ecosystem-scene) | 叙事场景 / 插画 | 文生图 |
| [服装改色](library/cases/editing/wardrobe-recolor) | 人像编辑 | 图生图 / 局部重绘 |

每个案例都有供搜索和自动化使用的 `case.yaml`，也有便于阅读的 `prompt.md`。新增内容前请先阅读[案例契约](library/schema/case.md)。

## 可复用提示词模板

[`library/templates/catalog.yaml`](library/templates/catalog.yaml) 提供了 30 套任务导向的提示词结构，覆盖 UI、信息图、活动海报、商品电商、品牌识别、空间、人像、分镜、教学图解、研发拆解与图像编辑。每套模板均包含：

```
可替换变量 + 需求解析协议 + 交付契约 + 质量门槛 + 风险控制 + Agent 执行数据
```

案例用于选择视觉方向，模板用于把方向变成可以放进真实需求单的可执行结构；两者分开维护，避免把灵感与生产规范混在一起。模板设计原则、选择规则和验收方式见 [`docs/template-system.md`](docs/template-system.md)。

## 本地浏览

内置 Vite 图库支持分类数量导航、全文搜索、模型与工作流筛选、生成封面预览、案例质量信息与一键复制模板。

```bash
npm install
npm run dev
```

在浏览器打开 `http://127.0.0.1:5173`。每次启动或构建都会从 `library/cases` 与 `library/templates` 重新生成目录数据。

## 如何使用

1. 按分类与标签找到案例。
2. 用你的需求替换 `{{变量}}`。
3. 阅读限制说明；最终文字排版和精确品牌标识通常应在设计工具中完成。
4. 标记为 `verified` 的案例只表示其曾在列出的模型上审阅过，并非跨模型保证。

## Agent 可用数据与 Skills

项目的三层资产从同一个源目录生成，而不是手工同步：

```
library/cases + library/templates
  → data/prompt-library.json（Agent / 自动化）
  → site/src/catalog.generated.ts（网站）
```

`data/prompt-library.json` 是稳定的机器可读目录，包含全部案例、工业模板、五维分类、封面值、变量、验证状态与限制说明。为了让提示词能直接进入生产，生成器会把每条原始视觉方向编译为“输入字段 → 交付规格 → 成品结构 → 质量门槛 → 禁忌项”的生产级提示词。`skills/open-image-prompt-library` 用它为 Codex、Claude Code、Cursor 等 Agent 推荐案例并组合模板。

安装后可以这样请求：`使用 open-image-prompt-library，为 GPT Image 推荐一个护肤品详情页案例和模板。`

### 图片反推提示词 Skill

`skills/img2prompt` 是这个内容库的配套工具：它会将参考图解析为模型无关的视觉规格，再分别渲染为 GPT、Nano Banana、Midjourney 或 Stable Diffusion 的提示词。它与内容库刻意分层：前者帮助创建或改造案例，后者保存可审阅、可复用的提示词资产。

```bash
npx skillport install ./skills/img2prompt --to claude,cursor,codex
```

## 参与贡献

贡献内容必须使用原创提示词以及原创或由本项目生成的预览图。每个案例都必须说明变量、验证状态与限制。

请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，然后运行：

```bash
npm install
npm test
```

项目使用帮助与社区规则见[支持说明](SUPPORT.md)、[治理规则](GOVERNANCE.md)、[安全策略](SECURITY.md)与[行为准则](CODE_OF_CONDUCT.md)，版本级变化记录在[更新日志](CHANGELOG.md)。

## 项目原则

- **结构优先。** 元数据也是内容的一部分。
- **仅收录原创内容。** 案例与预览图必须为本项目创作。
- **兼顾模型，不锁死模型。** 默认写通用提示词，模型差异明确记录。
- **如实验证。** 已验证结果要说明何时、在哪个模型上审阅。
- **尊重创作与隐私。** 不使用在世艺术家姓名，也不重建可辨识私人真实人物的面部。

## 许可证

仓库代码和文档采用 [MIT](LICENSE)。
