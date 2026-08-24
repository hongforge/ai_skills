# 方言：Midjourney

## 口味

逗号分隔的短语串 + 参数层。**不是句子**，是加权关键词流。

- **长度**：40–60 词。这是四个方言里最紧的预算，截断策略在这里真正生效
- **语序即权重**：越靠前权重越高。严格按 salience 1 → 2 → 3 排列
- **禁止**：完整句子、连接词（the / a / with / and 尽量省）
- **画幅**：用 `--ar` 参数，不写进正文

## salience 截断策略

**本方言必须主动截断。** 顺序：

1. 全部 salience 1 条目 —— 永不丢弃
2. salience 2 条目 —— 逐条加入直至逼近 60 词
3. salience 3 条目 —— 仅在仍有余量时加入

超预算时从**末尾的 salience 3 开始删**，绝不删中间。

## 参数层

正文之后，统一附参数：

| 参数 | 取值依据 |
|---|---|
| `--ar` | 从 `composition` 的画幅推断，如 `--ar 3:2` |
| `--style raw` | `style` 表明是写实/摄影时加；插画风格不加 |
| `--stylize` | 写实取 `50–150`，风格化取 `250–750` |
| `--no` | 直接由 `exclusions` 逗号拼接 |

`--sref` / `--cref` 仅在用户主动提供参考图 URL 时才写，**不要凭空生成**。

## IR 字段组 → 本方言表达

| IR 字段组 | 表达方式 |
|---|---|
| `subject` | 串首，最重的位置。名词短语，去冠词 |
| `composition` | 紧随其后的短语：`mid shot, eye level, rule of thirds` |
| `lighting` | 短语化：`soft key light from upper left, diffuse shadows` |
| `palette` | 短语：`warm brown and off-white palette` |
| `material` | 短语：`short matte fur, fine specular tips` |
| `camera` | 短语：`shallow depth of field, 85mm`。null 时**整条省略** |
| `style` | 短语：`clean commercial studio photography` |
| `text_in_image` | 引号内文字 + 字体短语。无文字或 null 时省略。**MJ 文字能力弱，此处应提醒用户** |
| `exclusions` | 不进正文，全部转入 `--no` 参数 |

## 模板

```
[subject], [composition], [lighting], [material], [palette], [style], [camera] --ar X:Y --style raw --stylize N --no a, b, c
```

## 示例

柯基示例：

```
corgi sitting facing camera mouth slightly open, mid shot, eye level, offset right, off-white seamless backdrop, soft key light upper left, diffuse shadow edges, short matte fur with fine specular tips, warm brown and cream palette, clean commercial studio photography, shallow depth of field --ar 3:2 --style raw --stylize 100 --no text, watermark, collar, clutter
```

54 词，salience 3 的「等效 85mm f/2.8」被丢弃 —— `shallow depth of field` 已覆盖同一意图，而词预算更值钱。

## 提醒用户

`text_in_image` 确有文字内容时，在输出后附一句：Midjourney 的文字渲染不可靠，该需求建议改用 GPT 或 Ideogram。**不要假装它能做到。**
