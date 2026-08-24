import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { CONTENT_GROUPS } from '../src/validate-ir.js';
import { SKILL_DIR, REFERENCES_DIR } from './helpers/paths.js';

const skillMd = () => fs.readFileSync(path.join(SKILL_DIR, 'SKILL.md'), 'utf8');

describe('SKILL.md', () => {
  it('存在', () => {
    expect(fs.existsSync(path.join(SKILL_DIR, 'SKILL.md'))).toBe(true);
  });

  it('frontmatter 的 name 与目录名一致', () => {
    const match = skillMd().match(/^---\n([\s\S]*?)\n---/);
    expect(match).not.toBeNull();
    expect(match![1]).toMatch(/^name:\s*img2prompt\s*$/m);
  });

  it('frontmatter 含 description', () => {
    const match = skillMd().match(/^---\n([\s\S]*?)\n---/);
    expect(match![1]).toMatch(/^description:\s*\S/m);
  });

  it('提及全部 9 个内容字段组', () => {
    const body = skillMd();
    for (const group of CONTENT_GROUPS) {
      expect(body, `SKILL.md 未提及字段组 ${group}`).toContain(group);
    }
  });

  // 架构红线：解析阶段不得感知目标模型。
  // 只约束 Stage 2 之前的区段 —— Stage 2 的路由表出现在解析完成之后，
  // 点名模型无害且对用户更有用，禁掉反而逼出「参数化提示词的图像模型」这类含糊说法。
  it('Stage 1 区段不出现任何具体模型名', () => {
    const body = skillMd();
    const stage2 = body.indexOf('## Stage 2');
    expect(stage2, 'SKILL.md 缺少 Stage 2 小节，无法界定 Stage 1 区段').toBeGreaterThan(0);

    const stage1 = body.slice(0, stage2);
    for (const name of ['GPT', 'Nano Banana', 'Midjourney', 'Stable Diffusion', 'SDXL']) {
      expect(stage1, `Stage 1 区段出现了模型名「${name}」，违反架构红线`).not.toContain(name);
    }
  });

  // 方言表的存在性由下方「方言表」套件负责（它按 glob 发现并逐份校验内容），
  // 这里只管非方言引用，避免两处重复断言同一件事。
  it('引用的非方言 references 文件真实存在', () => {
    const refs = [...skillMd().matchAll(/references\/([a-z0-9-]+\.md)/g)]
      .map((m) => m[1])
      .filter((f) => !f.startsWith('dialect-'));
    expect(refs.length).toBeGreaterThan(0);
    for (const ref of new Set(refs)) {
      expect(fs.existsSync(path.join(REFERENCES_DIR, ref)), `缺少 references/${ref}`).toBe(true);
    }
  });
});

describe('ir-schema.md', () => {
  it('存在且定义全部 9 个内容字段组', () => {
    const body = fs.readFileSync(path.join(REFERENCES_DIR, 'ir-schema.md'), 'utf8');
    for (const group of CONTENT_GROUPS) {
      expect(body, `ir-schema.md 未定义字段组 ${group}`).toContain(group);
    }
  });

  it('说明 salience 与 evidence 两个元属性', () => {
    const body = fs.readFileSync(path.join(REFERENCES_DIR, 'ir-schema.md'), 'utf8');
    expect(body).toContain('salience');
    expect(body).toContain('evidence');
    expect(body).toContain('observed');
    expect(body).toContain('inferred');
  });

  it('区分 null 的「无法判断」与「确认不存在」语义', () => {
    const body = fs.readFileSync(path.join(REFERENCES_DIR, 'ir-schema.md'), 'utf8');
    expect(body).toContain('无法判断');
    expect(body).toContain('确认不存在');
  });
});

describe('policy.md', () => {
  it('存在且覆盖两条内容红线', () => {
    const body = fs.readFileSync(path.join(REFERENCES_DIR, 'policy.md'), 'utf8');
    expect(body).toContain('在世艺术家');
    expect(body).toContain('面部');
  });
});
