# img2prompt 设计文档

日期：2026-08-24
状态：一期设计已确认，待实施

## 1. 目标

做一个工业级的开源图生提示词 skill：输入一张图片，输出可直接投喂给主流图像模型的专业提示词。

仓库 `ai_skills` 定位为 skill 集合，`img2prompt` 是首发 skill。

**分期**：

- **一期（本文档范围）**：逆向引擎 —— 图片解析为结构化规格，再渲染为各模型方言。附 6 个试点案例。
- **二期（不在本文档范围）**：分品类提示词模板库，复用一期的 IR schema。

一期的 6 个案例是试点，用于把 schema 压出问题。效果确认后再横向扩充品类。

## 2. 核心架构

两段式：视觉解析与方言渲染彻底分离。

```
输入图片
   │
   ▼
Stage 1: 视觉解析器（SKILL.md 主体，单一实现）
   │
   ▼  IR（结构化视觉规格，YAML）
   │
   ├──▶ dialect-gpt.md           → 叙事化自然段
   ├──▶ dialect-nano-banana.md   → 自然语言 + 编辑指令
   ├──▶ dialect-midjourney.md    → 短句 + 参数层
   └──▶ dialect-sd.md            → 正/负双提示词 + 权重
```

**架构红线：Stage 1 不得感知目标模型。**

理由：一旦解析阶段知道目标是 Midjourney（提示词偏短），它会主动省略细节，跨模型一致性随即崩塌。解析必须无条件抽取全量信息，取舍只发生在渲染阶段。

**扩展方式**：新增模型 = 新增一份方言表，Stage 1 与 IR schema 不变。

## 3. IR Schema

九个字段组。每个字段带两个元属性：

### 元属性

**`salience`（1–3，优先级）**

渲染器遇到目标模型的长度上限时，按 salience 由 3 向 1 依次丢弃。没有这个字段，压缩就是随机破坏信息。

**`evidence`（`observed` | `inferred`）**

区分「画面中直接可见」与「据经验推断」。

- `observed`：左上方射入的暖色轮廓光
- `inferred`：等效 85mm、f/1.4、黄金时刻

图片可解析度低时，`inferred` 字段允许为 null，**禁止编造**。`observed` 字段不得为空。

### 字段组

`meta` 是元信息，不计入内容字段组。其下的 9 个为**内容字段组**（测试中「覆盖全部 9 个字段组」即指这 9 个）：

```yaml
meta:                 # 元信息，不计入 9 个内容字段组
  intent: reproduce | restyle | style-extract
  legibility: high | medium | low

subject:        主体、数量、姿态、朝向、表情、关键属性
composition:    景别、机位高度、构图法则、前中后景分层、留白分布
lighting:       主光位与光质、补光、轮廓光、色温、明暗比、时间感(inferred)
palette:        主色/辅色/点缀色（含大致色值）、饱和度与影调倾向
material:       材质与表面特性（金属度、粗糙度、透光、次表面散射）
camera:         等效焦距(inferred)、光圈感、景深、畸变、介质(数码/胶片/CG/手绘)
style:          风格谱系、年代感、后期倾向
text_in_image:  画面内文字内容、字体气质、位置
exclusions:     从原图反推的负面词
```

### 元属性的承载方式

`salience` 与 `evidence` 挂在**条目级**，而非字段组级 —— 同一组内不同条目的重要性与确定性可以不同（主光位是 observed 且 salience 1，时间感是 inferred 且 salience 3）。

每个条目统一为三键结构：

```yaml
lighting:
  - value: 左上 45° 硬质主光，桶形柔光箱
    salience: 1
    evidence: observed
  - value: 右后方冷调轮廓光，色温约 7000K
    salience: 2
    evidence: observed
  - value: 黄金时刻自然光
    salience: 3
    evidence: inferred

camera:
  - value: null                    # 可解析度不足时留空，禁止编造
    salience: 2
    evidence: inferred
```

`exclusions` 为例外，是纯字符串数组，不带元属性。

### intent 三态

同一张图，三种用法通过一个字段切换：

| intent | 含义 | 解析侧重 |
|---|---|---|
| `reproduce` | 复现原图 | 主体细节最大化 |
| `restyle` | 换主体、保风格 | 弱化 subject，放大 style / lighting / palette |
| `style-extract` | 只取风格 | subject 降为泛化占位 |

## 4. 内容红线

硬编码进 `references/policy.md`，Stage 1 与所有方言表均须遵守。

**规则一：风格用视觉属性描述，不点名在世艺术家。**

写「厚涂笔触、高饱和补色对撞、粗黑轮廓线」，不写具体人名。

除合规考量外，这条也带来质量收益：不同模型对同一艺术家名字的理解差异极大，对属性描述的理解则一致，跨模型稳定性更好。

**规则二：可辨识的真实私人不做面部特征重建。**

降级为泛化描述（年龄段、气质、着装）。

## 5. 目录结构

```
ai_skills/
├── README.md / README.zh.md        中英双语
├── LICENSE                          MIT
├── skills/
│   └── img2prompt/
│       ├── SKILL.md                 Stage 1 解析指令
│       ├── references/
│       │   ├── ir-schema.md         字段定义与填写规范
│       │   ├── policy.md            内容红线
│       │   ├── dialect-gpt.md
│       │   ├── dialect-nano-banana.md
│       │   ├── dialect-midjourney.md
│       │   └── dialect-sd.md
│       └── examples/<case>/
└── test/
```

零依赖、零 API key。通过 skillport 安装到任意 agent：

```bash
npx skillport install ./skills/img2prompt --to claude,cursor,codex
```

## 6. 测试策略

提示词质量无法直接断言，但结构可以。按「能否免费自动化」切成三层。

### 第 1 层 · 静态校验（免费，PR 必过）

- skillport lint：frontmatter、命名、引用文件存在性
- **每份方言表必须覆盖全部 9 个 IR 字段组**（可 grep 断言）—— 防止新增方言表静默漏字段
- 每个 example 案例的文件齐全性

### 第 2 层 · Schema 校验（免费，PR 必过）

金标准 `ir.yaml` 按 schema 验证：

- 9 个内容字段组均存在
- 每个条目具备 `value` / `salience` / `evidence` 三键（`exclusions` 除外）
- `salience ∈ 1..3`
- `evidence ∈ {observed, inferred}`
- `evidence: inferred` 的条目 `value` 可为 null；`evidence: observed` 的条目 `value` 不得为 null 或空串

### 第 3 层 · 行为回归（需模型，`npm run eval` 可选）

金标准图片 → 运行 skill → 断言 IR 关键字段命中。

**为何第 3 层不进 CI**：需要调用模型，成本与稳定性都不适合作为 PR 门禁。前两层保证「结构不塌」，第三层保证「判断不飘」；混在一起会让 CI 结果取决于运气。

## 7. Showcase

### 原图来源

**主体使用已知提示词生成的 AI 图片。**

两个理由，第二个是关键：

1. 授权干净，可随仓库分发
2. 原始提示词已知，构成可测量的保真度闭环：

```
原始提示词 → 原图 → [skill] → IR → 复现提示词 → 复现图
      ↑                                            ↓
      └──────────── 保真度可对比 ──────────────────┘
```

掺入 1–2 张 CC0 真实照片（Unsplash / Pexels），防止过拟合到 AI 图特征。

### 首发 6 案例

挑选原则：每个案例压测不同的 IR 字段组，而非视觉观赏性。

| # | 标题 | 压测字段 |
|---|---|---|
| 1 | 产品静物 · 棚拍电商级 | `material` + `lighting` |
| 2 | 环境人像 · 自然光 | `camera` + `lighting` |
| 3 | 电影感场景 | `composition` + `palette` |
| 4 | 平面海报（含画面文字） | `text_in_image` |
| 5 | 3D / CG 渲染 | `material`（PBR） |
| 6 | 插画 · 手绘 | `style` + 红线验证 |

每案例产出：标题、原图、`ir.yaml`、四个模型的提示词、复现图。

### 实施顺序

**代码部分不依赖图片，不得被图片阻塞。**

先完成骨架、SKILL.md、四份方言表、IR schema 与测试；showcase 目录留结构与占位。图片生成单独作为一轮任务处理（本机 `media-use` skill 可调图像模型，实际产出质量待验证）。

## 8. 风险与缓解

| 风险 | 缓解 |
|---|---|
| schema 定错，返工成本高 | 先用 6 案例跑通再冻结；方言表不急于写满 |
| 二期模板库依赖一期 schema 质量 | 一期把 schema 压力测试做足 |
| Midjourney 参数版本变动快 | 隔离在方言表内，不波及 Stage 1 |
| AI 生成图过拟合 | 掺入 CC0 真实照片 |

## 9. 一期完成标准

- [ ] SKILL.md + 4 份方言表 + ir-schema.md + policy.md 齐备
- [ ] 第 1、2 层测试通过并接入 CI
- [ ] 6 个案例的 IR 与四模型提示词产出完整
- [ ] 中英双语 README
- [ ] 可通过 skillport 安装
