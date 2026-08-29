# 方言：Stable Diffusion / SDXL / ComfyUI

## 口味

标签制，**正负双提示词**。唯一需要显式权重语法的方言。

- **正提示词**：逗号分隔标签，60–80 词
- **负提示词**：由 `exclusions` + 通用画质负面词组成，独立输出
- **权重语法**：`(tag:1.2)` 加权、`(tag:0.8)` 减权。取值范围守在 `0.7–1.4`，超出易崩图
- **语序即权重**：与 Midjourney 同理，靠前更重

## salience 截断策略

不靠删除，靠**加权**。这是本方言与 Midjourney 的关键差异 —— 词预算相对宽松，所以 salience 映射为权重而非去留：

| salience | 权重写法 |
|---|---|
| 1 | `(tag:1.3)` |
| 2 | 裸写，无括号（等价 1.0） |
| 3 | `(tag:0.9)`，或超预算时丢弃 |

**不要给所有标签都加权。** 满屏括号会让权重体系失效 —— 全部加重等于全部没加重。只加权 salience 1 与确需压低的条目。

## 负提示词基线

无论 `exclusions` 内容如何，恒定附加以下通用画质负面词：

```
lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit,
fewer digits, cropped, worst quality, low quality, jpeg artifacts, signature,
watermark, username, blurry
```

再把 `exclusions` 逐条拼接其后。

## IR 字段组 → 本方言表达

| IR 字段组 | 表达方式 |
|---|---|
| `subject` | 正提示词串首，salience 1 故加权：`(corgi sitting facing camera:1.3)` |
| `composition` | 标签：`mid shot, eye level, rule of thirds composition` |
| `lighting` | 标签：`soft key light from upper left, diffuse shadows` |
| `palette` | 标签：`warm brown and cream color palette` |
| `material` | 标签：`short matte fur, fine specular highlights` |
| `camera` | 标签：`shallow depth of field, 85mm lens`。null 时省略 |
| `style` | 标签：`commercial studio photography, high detail` |
| `text_in_image` | SD 文字能力弱。确有文字时照写并提醒用户 |
| `exclusions` | **全部进负提示词**，不进正提示词 |

## 输出格式

始终输出两段，各自独立成块：

```
Positive:
[标签串]

Negative:
[通用画质负面词], [exclusions]
```

## 建议参数

一并给出，用户可直接套用：

- Steps: `28–35`
- CFG: `6–8`（写实取低，风格化取高）
- Sampler: `DPM++ 2M Karras`

## 示例

柯基示例：

```
Positive:
(corgi sitting facing camera, mouth slightly open:1.3), mid shot, eye level,
subject offset right, off-white seamless backdrop, soft key light from upper left,
diffuse shadow edges, short matte fur, fine specular highlights, warm brown and
cream color palette, commercial studio photography, shallow depth of field,
(85mm lens:0.9)

Negative:
lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit,
fewer digits, cropped, worst quality, low quality, jpeg artifacts, signature,
watermark, username, blurry, collar, background clutter
```

只有两处带权重：salience 1 的主体加重到 1.3，salience 3 的镜头压到 0.9。其余裸写。
