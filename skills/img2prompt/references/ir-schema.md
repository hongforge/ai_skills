# IR Schema

图片解析的结构化产物。所有方言渲染都从这份规格出发。

## 元属性

每个条目携带两个元属性，这是 IR 区别于普通「看图说话」的地方。

### salience（1–3）

截断优先级。目标模型有长度上限时，渲染器按 salience **从 3 向 1** 依次丢弃。

| 值 | 含义 | 判据 |
|---|---|---|
| 1 | 身份性 | 丢掉它，图就不是这张图了 |
| 2 | 特征性 | 丢掉它，还认得出，但味道变了 |
| 3 | 附加性 | 丢掉它，几乎无感 |

### evidence（observed / inferred）

区分「看到的」和「推断的」。

- `observed` —— 画面中直接可见。**value 不得为 null 或空串**。
- `inferred` —— 据经验推断。**value 允许为 null**。

看不清就留 null。编造一个 `85mm f/1.4` 会污染下游全部四份提示词，而留空只是少一条信息。

#### null 只表示「无法判断」

**不要用 null 表示「确认不存在」。** 这是两件事：

| 情况 | 写法 |
|---|---|
| 图太糊，看不出有没有文字 | `value: null` / `evidence: inferred` |
| 看清楚了，确认没有文字 | `value: 画面内无文字` / `evidence: observed` |

「确认不存在」是一个观察结果，要写出来。两者混用会让方言渲染无从判断该保守还是该放心省略。

## 条目结构

除 `exclusions` 外，所有字段组都是条目数组，每个条目三个键：

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
  - value: null                # 可解析度不足，留空而非编造
    salience: 2
    evidence: inferred
```

`exclusions` 是纯字符串数组，不带元属性：

```yaml
exclusions: [文字, 水印, 多余手指]
```

## meta

不计入 9 个内容字段组。

```yaml
meta:
  intent: reproduce | restyle | style-extract
  legibility: high | medium | low
```

## 9 个内容字段组

顺序固定，逐组填写，不跳组。

### subject

主体、数量、姿态、朝向、表情、关键属性。

`intent: style-extract` 时降为泛化占位（如「一个主体」）。

### composition

景别（特写/中景/全景）、机位高度（俯/平/仰）、构图法则（三分/中心/对角/框架）、前中后景分层、留白分布。

### lighting

主光位与光质（硬/柔）、补光、轮廓光、色温、明暗比、时间感。

时间感（黄金时刻、正午、蓝调）几乎总是 `inferred`。

### palette

主色/辅色/点缀色，带大致色值倾向（如「深青 #1B4B5A 附近」）、饱和度与影调倾向（高调/低调）。

### material

材质与表面特性：金属度、粗糙度、透光、次表面散射、磨损痕迹。

产品图与 CG 图的胜负手。

### camera

等效焦距、光圈感、景深、畸变、介质（数码/胶片/CG 渲染/手绘）。

除介质外，多为 `inferred`。

### style

风格谱系、年代感、后期倾向。

**用视觉属性描述，不点名在世艺术家**（见 `policy.md`）。

### text_in_image

画面内文字的内容、字体气质、位置。

确认无文字时写 `value: 画面内无文字` 并标 `observed`；看不清时才用 `null`。文字渲染是部分模型的强项，漏填等于放弃该能力。

### exclusions

从原图反推的负面词 —— 这张图里**明显没有**、且模型容易自作主张加上的东西。

## 完整示例

```yaml
meta:
  intent: reproduce
  legibility: high

subject:
  - value: 一只柯基犬，坐姿，正面朝向镜头，微张嘴
    salience: 1
    evidence: observed

composition:
  - value: 中景，平视机位，主体居中略偏右
    salience: 1
    evidence: observed
  - value: 背景大面积留白
    salience: 2
    evidence: observed

lighting:
  - value: 左上 45° 柔光主光，阴影边缘柔和
    salience: 1
    evidence: observed
  - value: 棚拍布光
    salience: 2
    evidence: inferred

palette:
  - value: 暖棕主色，米白背景，黑色鼻头作点缀
    salience: 2
    evidence: observed

material:
  - value: 短毛，哑光，毛尖有细微高光
    salience: 2
    evidence: observed

camera:
  - value: 数码，浅景深，背景轻微虚化
    salience: 2
    evidence: observed
  - value: 等效 85mm，f/2.8 附近
    salience: 3
    evidence: inferred

style:
  - value: 干净的商业棚拍，高完成度，无强烈后期风格
    salience: 2
    evidence: inferred

text_in_image:
  - value: 画面内无文字
    salience: 3
    evidence: observed

exclusions: [文字, 水印, 项圈, 杂乱背景]
```
