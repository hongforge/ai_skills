import fs from 'node:fs';
import path from 'node:path';
import { stringify } from 'yaml';

const ROOT = process.cwd();

type CaseSeed = readonly [id: string, title: string, summary: string, variables: string[], prompt: string];

type Group = {
  collection: string;
  taxonomy: Record<string, string[]>;
  tags: string[];
  cases: CaseSeed[];
};

const groups: Group[] = [
  {
    collection: 'ui', tags: ['界面设计', '产品体验', '版式层级'],
    taxonomy: { deliverable: ['ui-interface'], medium: ['vector-graphic'], workflow: ['text-to-image'], capability: ['layout-hierarchy', 'text-rendering', 'instruction-following'], model: ['universal', 'gpt-image'] },
    cases: [
      ['fintech-analytics-dashboard', '金融分析仪表盘', '面向专业用户的深色金融数据监控界面。', ['product_name', 'primary_metric'], 'Design a polished dark-mode analytics dashboard for {{product_name}}. Make {{primary_metric}} the dominant KPI, supported by a compact line chart, portfolio allocation donut, watchlist table, and clear risk states. Use a restrained graphite surface, crisp spacing, subtle mint data highlights, and credible financial-product information hierarchy. No real company logos, no watermark.'],
      ['focus-mobile-app', '专注习惯移动应用', '以单一任务和温和进度反馈为核心的移动端界面。', ['app_name', 'daily_goal'], 'Create a calm mobile app home screen for {{app_name}}, centered on a single daily focus session and the goal {{daily_goal}}. Include an elegant circular progress control, one primary action, a minimal habit streak, and a small weekly history. Soft warm background, tactile cards, highly legible mobile UI, no device frame, no watermark.'],
      ['ai-saas-landing-page', 'AI SaaS 落地页', '强调产品价值、可信度与清晰转化路径的营销首页。', ['product_name', 'core_benefit'], 'Design a high-converting SaaS landing page for {{product_name}}. The hero must communicate {{core_benefit}} with a clear headline, one primary call to action, a believable product preview, three concise benefit modules, and a customer-proof strip. Editorial grid, airy spacing, confident contemporary typography, no real brand logos, no watermark.'],
      ['ecommerce-product-detail-page', '电商商品详情页', '突出商品信息、规格选择与购买决策的商品页。', ['product_type', 'brand_name'], 'Create a premium e-commerce product detail page for a {{product_type}} by {{brand_name}}. Feature a large gallery, concise product story, color and size selectors, delivery details, ratings, and a strong add-to-bag action. Keep the interface calm, editorial, and conversion-focused. No real marketplace logos, no watermark.'],
      ['travel-booking-flow', '旅行预订流程', '覆盖目的地发现、日期选择和订单摘要的预订界面。', ['destination', 'travel_style'], 'Design a travel booking interface for {{destination}} tailored to {{travel_style}} travelers. Show a scenic search result, date picker, flexible fare comparison, map context, and a transparent booking summary. Use a bright editorial travel aesthetic, clear hierarchy, and practical form controls. No real travel brand, no watermark.'],
      ['developer-ops-console', '开发运维控制台', '面向工程团队的服务健康与部署状态控制台。', ['service_name', 'environment'], 'Design an operations console for {{service_name}} in the {{environment}} environment. Include deployment status, service health, latency chart, incident timeline, logs preview, and an unmistakable rollback action. Dense but readable developer tooling, dark interface, semantic status color, no real vendor logos, no watermark.'],
      ['course-learning-portal', '在线课程学习门户', '将课程进度、视频学习与作业反馈整合在一起的学习平台。', ['course_title', 'learner_name'], 'Create an online learning portal for {{learner_name}} enrolled in {{course_title}}. Present the current lesson, a video player placeholder, lesson outline, progress bar, upcoming assignment, and instructor feedback. Friendly academic UI, accessible contrast, organized reading rhythm, no watermark.'],
    ],
  },
  {
    collection: 'data', tags: ['信息图', '可视化', '知识表达'],
    taxonomy: { deliverable: ['infographic', 'educational-visual'], medium: ['vector-graphic'], workflow: ['text-to-image'], capability: ['data-visualization', 'layout-hierarchy', 'text-rendering'], model: ['universal', 'gpt-image'] },
    cases: [
      ['climate-heat-map', '气候热力地图', '将区域温度变化转化为可读热力地图的科普视觉。', ['region', 'time_period'], 'Create an editorial climate heat map for {{region}} during {{time_period}}. Combine a simplified geographic outline, a clear temperature gradient, a compact legend, key annotations, and one takeaway statistic. Scientific but approachable vector design, strong hierarchy, no watermark.'],
      ['system-architecture-explainer', '系统架构图解', '帮助非技术读者理解服务关系与数据流的架构图。', ['system_name', 'core_flow'], 'Design a clean system architecture explainer for {{system_name}}. Visualize {{core_flow}} through clearly separated client, application, data, and monitoring layers with directional arrows and concise labels. Technical editorial diagram, consistent icon language, generous whitespace, no watermark.'],
      ['product-roadmap-timeline', '产品路线图时间线', '展示季度目标、里程碑与依赖关系的产品路线图。', ['product_name', 'planning_year'], 'Create a horizontal product roadmap for {{product_name}} in {{planning_year}}. Show four quarters, major initiatives, dependencies, confidence states, and milestone markers. Use an executive-ready information hierarchy, restrained color coding, and readable planning details. No watermark.'],
      ['science-process-poster', '科学过程海报', '用分步骤图示解释科学现象的教育海报。', ['phenomenon', 'key_stages'], 'Design a vertical educational poster explaining {{phenomenon}} through {{key_stages}}. Use one central illustration, numbered stages, arrows, short evidence-based labels, and a clear summary statement. Warm modern science publishing style, accessible contrast, no watermark.'],
    ],
  },
  {
    collection: 'posters', tags: ['海报设计', '排版', '视觉传播'],
    taxonomy: { deliverable: ['poster-editorial'], medium: ['vector-graphic', 'mixed-media'], workflow: ['text-to-image'], capability: ['layout-hierarchy', 'text-rendering', 'instruction-following'], model: ['universal', 'gpt-image', 'midjourney'] },
    cases: [
      ['music-festival-poster', '音乐节海报', '以强烈节奏和信息层级呈现演出阵容的活动海报。', ['festival_name', 'date_location'], 'Create a bold vertical music festival poster for {{festival_name}}. Make {{date_location}} prominent, with a strong typographic hierarchy, abstract kinetic shapes, an artist-list area, and a limited high-contrast palette. Contemporary editorial print design, no real logos, no watermark.'],
      ['literary-book-cover', '文学书籍封面', '以隐喻图像与克制排版传达文学气质的封面。', ['book_title', 'central_metaphor'], 'Design a literary book cover for {{book_title}} using {{central_metaphor}} as the central visual idea. Use restrained composition, tactile paper texture, expressive but minimal typography space, and an elegant editorial mood. Leave title lettering as clear placeholder geometry, no watermark.'],
      ['tech-conference-poster', '科技会议海报', '结合技术主题、演讲信息和高辨识度视觉符号的会议海报。', ['event_name', 'theme'], 'Create a sophisticated technology conference poster for {{event_name}} about {{theme}}. Combine one memorable conceptual graphic with a rigorous grid, headline area, date-and-venue information blocks, and a compact speaker section. Precision editorial design, no real logos, no watermark.'],
      ['social-quote-card', '社交媒体语录卡片', '适合发布与转发的简洁观点语录视觉。', ['quote', 'author_role'], 'Create a square social media quote card for the statement {{quote}} by {{author_role}}. Use a strong typographic composition, one understated visual motif, generous padding, and high readability at small size. Contemporary editorial graphic design, no watermark.'],
    ],
  },
  {
    collection: 'brand', tags: ['品牌设计', '包装', '视觉识别'],
    taxonomy: { deliverable: ['brand-identity'], medium: ['vector-graphic', 'mixed-media'], workflow: ['text-to-image'], capability: ['layout-hierarchy', 'material-lighting', 'instruction-following'], model: ['universal', 'gpt-image', 'midjourney'] },
    cases: [
      ['skincare-brand-system', '护肤品牌识别', '展示护肤品牌色彩、包装与视觉语言的识别系统。', ['brand_name', 'brand_positioning'], 'Create a refined visual identity board for {{brand_name}}, positioned as {{brand_positioning}}. Show a wordmark placeholder, color palette, skincare bottle and carton mockups with blank labels, material samples, and campaign art direction. Quiet luxury, modern editorial layout, no real logos, no watermark.'],
      ['coffee-packaging-system', '咖啡包装系统', '为单品咖啡建立系列化包装与货架识别方向。', ['coffee_brand', 'origin_story'], 'Design a coffee packaging system for {{coffee_brand}} inspired by {{origin_story}}. Include several bags with blank labels, a color-and-pattern system, roast indicators, and a small shelf arrangement. Tactile print design, clear product differentiation, no readable brand text, no watermark.'],
      ['logo-concept-board', '标志概念板', '通过形状、应用场景和色彩展示品牌标志探索方向。', ['brand_name', 'brand_values'], 'Create a logo concept presentation board for {{brand_name}} based on {{brand_values}}. Explore three abstract mark directions, monochrome applications, small-scale usage, and a concise color palette. Vector-friendly geometry, professional identity-design process, no copied trademarks, no watermark.'],
    ],
  },
  {
    collection: 'commerce', tags: ['商品电商', '商业摄影', '产品展示'],
    taxonomy: { deliverable: ['product-commerce'], medium: ['photography', '3d-render'], workflow: ['text-to-image'], capability: ['product-fidelity', 'material-lighting', 'layout-hierarchy'], model: ['universal', 'gpt-image', 'nano-banana'] },
    cases: [
      ['sneaker-launch-hero', '运动鞋发布主视觉', '以动态姿态和材质细节凸显鞋款性能的广告视觉。', ['shoe_style', 'accent_color'], 'Create a dynamic commercial hero image for a {{shoe_style}} sneaker with {{accent_color}} accents. Show one shoe in a dramatic suspended pose, with material detail, controlled shadow, and a clean background suitable for campaign copy. High-end sports advertising photography, no logo, no watermark.'],
      ['cosmetics-flat-lay', '美妆产品平铺', '通过秩序、材质和色彩组织展示美妆系列。', ['product_family', 'palette'], 'Create a premium flat-lay beauty campaign for {{product_family}} using a {{palette}} color story. Arrange unbranded cosmetic objects, textured paper, glass, and natural shadows in a balanced editorial composition. Beauty photography, tactile materials, no readable label text, no watermark.'],
      ['furniture-lifestyle-scene', '家具生活方式场景', '在真实居住场景中突出单件家具的材质与尺度。', ['furniture_piece', 'interior_style'], 'Create an editorial lifestyle image featuring a {{furniture_piece}} in a {{interior_style}} home. Emphasize proportion, material tactility, soft daylight, and a lived-in but uncluttered atmosphere. Architectural interior photography, no people, no logos, no watermark.'],
      ['food-packaging-launch', '食品包装发布图', '为食品新品构建干净明快的包装与食材主视觉。', ['food_product', 'flavor_note'], 'Create a vibrant packaging launch visual for {{food_product}} with a {{flavor_note}} flavor direction. Feature one unbranded package, fresh ingredient cues, crisp studio lighting, and a playful but premium composition. Keep packaging text blank, no logos, no watermark.'],
      ['jewelry-macro-detail', '珠宝微距细节图', '利用精确高光与背景虚化表现珠宝工艺细节。', ['jewelry_piece', 'metal_finish'], 'Create a luxury macro product image of a {{jewelry_piece}} with a {{metal_finish}} finish. Show precise reflections, fine craftsmanship, shallow depth of field, and an elegant dark neutral background. High-end jewelry photography, no logos, no watermark.'],
    ],
  },
  {
    collection: 'spaces', tags: ['建筑空间', '室内设计', '环境氛围'],
    taxonomy: { deliverable: ['architecture-space'], medium: ['photography', '3d-render'], workflow: ['text-to-image'], capability: ['spatial-reasoning', 'material-lighting', 'layout-hierarchy'], model: ['universal', 'midjourney', 'stable-diffusion'] },
    cases: [
      ['minimalist-loft-interior', '极简阁楼室内', '以自然光、材料层次和留白展现现代居住空间。', ['room_function', 'material_palette'], 'Create a wide architectural interior of a minimalist loft {{room_function}} using {{material_palette}}. Emphasize daylight, thoughtful circulation, tactile surfaces, and an uncluttered lived-in composition. Architectural photography quality, no people, no logos, no watermark.'],
      ['eco-hotel-exterior', '生态酒店外观', '将可持续材料与自然地形结合的酒店建筑概念。', ['location_type', 'sustainable_material'], 'Create an architectural exterior for an eco hotel in {{location_type}}. Integrate the building into the terrain using {{sustainable_material}}, shaded terraces, native planting, and warm early-evening light. Credible architectural visualization, no signage, no watermark.'],
      ['retail-interior-concept', '零售店室内概念', '以清晰动线和商品焦点打造沉浸式零售空间。', ['store_type', 'brand_mood'], 'Design an immersive retail interior for a {{store_type}} with a {{brand_mood}} atmosphere. Show an inviting entrance, clear customer path, modular product display, focal lighting, and realistic materials. Editorial interior visualization, no visible trademarks, no watermark.'],
      ['landscape-pavilion', '景观亭建筑', '用轻盈结构与步行动线连接自然景观的公共亭子。', ['landscape_setting', 'structural_material'], 'Create a contemporary public pavilion in {{landscape_setting}} built from {{structural_material}}. Show how the light structure frames views, supports walking paths, and welcomes quiet gathering. Human-scale architectural rendering, atmospheric daylight, no text, no watermark.'],
    ],
  },
  {
    collection: 'photography', tags: ['摄影', '人像', '真实感'],
    taxonomy: { deliverable: ['portrait-character'], medium: ['photography'], workflow: ['text-to-image'], capability: ['material-lighting', 'subject-consistency', 'instruction-following'], model: ['universal', 'gpt-image', 'nano-banana'] },
    cases: [
      ['natural-light-portrait', '自然光环境人像', '利用环境与柔和光线呈现真实克制的人像肖像。', ['subject_description', 'location'], 'Create an editorial environmental portrait of {{subject_description}} in {{location}}. Use soft natural side light, candid posture, believable skin texture, and contextual details that support the story without distracting. Contemporary photography, no retouching excess, no watermark.'],
      ['street-fashion-editorial', '街头时尚编辑片', '通过城市空间、动作和造型呈现当代街头时尚。', ['outfit_direction', 'city_setting'], 'Create a street-fashion editorial photograph featuring {{outfit_direction}} in {{city_setting}}. Use a confident walking pose, dynamic urban geometry, controlled motion, and direct flash balanced with ambient light. Magazine-quality photography, no logos, no watermark.'],
      ['food-editorial-closeup', '美食编辑特写', '以光影、质地与细节呈现食物的真实诱人状态。', ['dish_name', 'serving_style'], 'Create an editorial food close-up of {{dish_name}} served in {{serving_style}}. Highlight steam, crisp surface texture, fresh garnish, and appetizing natural light while keeping the composition elegant and believable. Restaurant photography, no text, no watermark.'],
      ['automotive-campaign-shot', '汽车广告摄影', '以环境尺度与高光控制突出汽车造型的广告摄影。', ['vehicle_type', 'landscape'], 'Create a cinematic automotive campaign image of a {{vehicle_type}} moving through {{landscape}}. Use carefully controlled reflections, grounded road contact, a wide environmental composition, and premium commercial lighting. No brand badge, no watermark.'],
    ],
  },
  {
    collection: 'characters', tags: ['角色设计', '人物设定', 'IP 形象'],
    taxonomy: { deliverable: ['portrait-character'], medium: ['illustration', '3d-render'], workflow: ['text-to-image', 'series-consistency'], capability: ['subject-consistency', 'material-lighting', 'instruction-following'], model: ['universal', 'midjourney', 'stable-diffusion'] },
    cases: [
      ['fantasy-character-sheet', '奇幻角色设定表', '展示服装、道具、表情与材质细节的完整角色设定。', ['character_role', 'world_rule'], 'Create a professional character design sheet for a {{character_role}} shaped by {{world_rule}}. Include a full-body front view, profile view, expression strip, key prop callouts, and material notes. Original fantasy concept art, clean neutral background, no text reliance, no watermark.'],
      ['collectible-toy-concept', '收藏玩具概念图', '为原创角色建立可生产的收藏玩具造型与包装氛围。', ['character_theme', 'material_finish'], 'Create a collectible designer-toy concept based on {{character_theme}} with a {{material_finish}} finish. Show one full figure, a small accessory, and a simple blank package form. Polished product render, friendly proportions, original design, no branded characters, no watermark.'],
      ['friendly-mascot-system', '友好吉祥物系统', '通过姿势与表情建立可用于产品沟通的吉祥物形象。', ['mascot_species', 'brand_trait'], 'Design a friendly original {{mascot_species}} mascot that communicates {{brand_trait}}. Show a hero pose, three expressive gestures, a simple color palette, and consistent silhouette logic. Vector-friendly character design, no text, no watermark.'],
      ['character-turnaround', '角色三视图', '为三维建模或系列插画提供稳定比例的角色三视图。', ['character_concept', 'costume_material'], 'Create a clean three-view turnaround for {{character_concept}} wearing {{costume_material}}. Keep front, side, and back views aligned at the same scale with consistent proportions and clear silhouette. Production-ready character reference, plain background, no watermark.'],
    ],
  },
  {
    collection: 'storytelling', tags: ['叙事场景', '世界观', '故事板'],
    taxonomy: { deliverable: ['scene-storytelling'], medium: ['illustration', 'mixed-media'], workflow: ['text-to-image', 'series-consistency'], capability: ['spatial-reasoning', 'subject-consistency', 'instruction-following'], model: ['universal', 'midjourney', 'stable-diffusion'] },
    cases: [
      ['cinematic-storyboard-sequence', '电影故事板序列', '通过连续镜头建立动作与情绪节奏的故事板。', ['scene_premise', 'emotional_turn'], 'Create a six-panel cinematic storyboard for {{scene_premise}} ending with {{emotional_turn}}. Vary establishing, medium, close, and detail shots while maintaining clear continuity, eyelines, and visual pacing. Monochrome production storyboard with restrained accent tone, no watermark.'],
      ['childrens-book-spread', '儿童绘本跨页', '以可读动作与温暖环境讲述单一瞬间的绘本跨页。', ['story_moment', 'main_character'], 'Create a warm children’s book double-page spread showing {{main_character}} during {{story_moment}}. Use inviting shapes, clear focal action, small discoverable details, and a safe blank area for future text. Original gentle illustration, no existing characters, no watermark.'],
      ['documentary-scene-concept', '纪录片场景概念', '以真实环境细节和克制观察感建立纪录片气质。', ['subject_place', 'human_activity'], 'Create a documentary-style still in {{subject_place}} focused on {{human_activity}}. Use observational framing, natural available light, layered environmental detail, and an honest unposed mood. Photographic realism, respectful distance, no watermark.'],
    ],
  },
  {
    collection: 'publishing', tags: ['出版设计', '文档', '编辑排版'],
    taxonomy: { deliverable: ['document-publishing'], medium: ['vector-graphic'], workflow: ['text-to-image'], capability: ['layout-hierarchy', 'text-rendering', 'data-visualization'], model: ['universal', 'gpt-image'] },
    cases: [
      ['annual-report-cover', '年度报告封面', '面向企业发布场景的克制专业年度报告封面。', ['organization_type', 'report_year'], 'Design a sophisticated annual report cover for a {{organization_type}} in {{report_year}}. Use an abstract visual metaphor, confident grid, subtle material texture, and a clear title zone. Corporate editorial design, no real logo, no watermark.'],
      ['editorial-magazine-spread', '杂志编辑跨页', '在图像、标题与正文之间建立清晰节奏的杂志跨页。', ['article_topic', 'image_direction'], 'Create a contemporary magazine double-page spread about {{article_topic}} using {{image_direction}}. Balance a dominant image, headline system, intro deck, pull quote, and body-text columns as editable placeholder geometry. Refined editorial layout, no watermark.'],
      ['whitepaper-cover-system', '白皮书封面系统', '用理性图形与信息层级建立技术白皮书视觉系统。', ['report_topic', 'audience'], 'Design a technical whitepaper cover system for {{report_topic}} aimed at {{audience}}. Combine a precise abstract diagram, strong title hierarchy, issue metadata, and subtle grid logic. Trustworthy enterprise publishing design, no real logos, no watermark.'],
    ],
  },
  {
    collection: 'editing', tags: ['图片编辑', '局部修改', '图生图'],
    taxonomy: { deliverable: ['portrait-character', 'product-commerce'], medium: ['photography'], workflow: ['image-to-image', 'inpainting', 'compositing'], capability: ['subject-consistency', 'product-fidelity', 'instruction-following'], model: ['gpt-image', 'nano-banana', 'stable-diffusion'] },
    cases: [
      ['product-background-replace', '商品背景替换', '仅更换商品环境，同时保留边缘、光影与商品外观。', ['product', 'new_background'], 'Change only the background behind {{product}} to {{new_background}}. Preserve the product shape, label, material, scale, camera angle, edges, shadows, and original lighting direction. Match reflections and contact shadow naturally. Do not add text, logos, or watermark.'],
      ['object-removal-cleanup', '画面杂物移除', '在不破坏场景结构的前提下移除指定干扰物。', ['object_to_remove', 'scene_type'], 'Remove only {{object_to_remove}} from this {{scene_type}} image. Reconstruct the hidden background with matching perspective, texture, lighting, shadows, and depth of field. Preserve every other object and the original composition. No added elements, no watermark.'],
      ['interior-furniture-replace', '室内家具替换', '替换指定家具并保持空间透视、比例和光线一致。', ['existing_item', 'replacement_item'], 'Replace only {{existing_item}} with {{replacement_item}} in the interior. Keep the room architecture, viewpoint, camera lens feel, lighting, shadows, decor, and scale unchanged. Match the replacement’s material and contact points to the scene. No text, no watermark.'],
      ['seasonal-scene-conversion', '季节场景转换', '转换季节氛围，同时保护地点、建筑和人物构图。', ['source_season', 'target_season'], 'Transform this scene from {{source_season}} to {{target_season}} while preserving the exact location, architecture, people, camera angle, composition, and time of day. Update only vegetation, weather cues, ground conditions, and ambient color temperature naturally. No text, no watermark.'],
      ['product-cutout-transparency', '商品透明背景抠图', '为电商与设计合成提取干净完整的商品主体。', ['product_description', 'edge_detail'], 'Extract {{product_description}} onto a genuinely transparent background. Preserve all {{edge_detail}}, fine material details, natural silhouette, and original proportions. Remove every background pixel and cast shadow unless the product itself includes it. No text, no watermark.'],
    ],
  },
];

let created = 0;
for (const group of groups) {
  for (const [id, title, summary, variables, prompt] of group.cases) {
    const directory = path.join(ROOT, 'library', 'cases', group.collection, id);
    if (fs.existsSync(path.join(directory, 'case.yaml'))) continue;
    fs.mkdirSync(directory, { recursive: true });
    const metadata = {
      id,
      title,
      summary,
      taxonomy: group.taxonomy,
      tags: [...group.tags, title],
      license: { prompt: 'CC0-1.0', reference: 'none' },
      source: { kind: 'original', url: null, rights_note: 'Original repository content.' },
      prompt: { language: 'en', variables },
      evaluation: { status: 'draft', tested_models: [], last_verified: null, limitations: ['Use the prompt as a starting point and review model output before production use.'] },
    };
    fs.writeFileSync(path.join(directory, 'case.yaml'), stringify(metadata));
    fs.writeFileSync(path.join(directory, 'prompt.md'), `# ${title}\n\n## Prompt\n\n${prompt}\n\n## 使用说明\n\n${summary}\n`);
    created += 1;
  }
}

console.log(`Created ${created} starter cases.`);
