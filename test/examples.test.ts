import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { validateIr, CONTENT_GROUPS } from '../src/validate-ir.js';
import { EXAMPLES_DIR } from './helpers/paths.js';

const STATUSES = ['pending', 'complete'];
const SOURCES = ['ai-generated', 'cc0-photo'];

const caseDirs = fs.existsSync(EXAMPLES_DIR)
  ? fs
      .readdirSync(EXAMPLES_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  : [];

describe('showcase 案例', () => {
  // 守卫：目录为空时 it.each 不生成用例，没有这条会静默通过
  it('首发 6 个案例', () => {
    expect(caseDirs.length).toBe(6);
  });

  it.each(caseDirs)('%s 的 case.yaml 合法', (dir) => {
    const file = path.join(EXAMPLES_DIR, dir, 'case.yaml');
    expect(fs.existsSync(file), `缺少 ${dir}/case.yaml`).toBe(true);

    const meta = parse(fs.readFileSync(file, 'utf8'));

    expect(typeof meta.title, `${dir}: title 必须是字符串`).toBe('string');
    expect(meta.title.trim().length).toBeGreaterThan(0);

    expect(Array.isArray(meta.stresses), `${dir}: stresses 必须是数组`).toBe(true);
    expect(meta.stresses.length).toBeGreaterThan(0);
    for (const group of meta.stresses) {
      expect(CONTENT_GROUPS, `${dir}: stresses 含非法字段组 ${group}`).toContain(group);
    }

    expect(STATUSES, `${dir}: status 非法`).toContain(meta.status);
    expect(SOURCES, `${dir}: source 非法`).toContain(meta.source);
  });

  it.each(caseDirs)('%s 若 status 为 complete 则产物齐全且 IR 合法', (dir) => {
    const caseDir = path.join(EXAMPLES_DIR, dir);
    const meta = parse(fs.readFileSync(path.join(caseDir, 'case.yaml'), 'utf8'));

    if (meta.status !== 'complete') return;

    for (const artifact of ['source.png', 'ir.yaml', 'prompts.md']) {
      expect(fs.existsSync(path.join(caseDir, artifact)), `${dir} 缺少 ${artifact}`).toBe(true);
    }

    const ir = parse(fs.readFileSync(path.join(caseDir, 'ir.yaml'), 'utf8'));
    expect(validateIr(ir), `${dir}/ir.yaml 校验失败`).toEqual([]);
  });

  it('全部 9 个字段组都至少被一个案例压测', () => {
    const covered = new Set<string>();
    for (const dir of caseDirs) {
      const meta = parse(fs.readFileSync(path.join(EXAMPLES_DIR, dir, 'case.yaml'), 'utf8'));
      for (const g of meta.stresses) covered.add(g);
    }
    for (const group of CONTENT_GROUPS) {
      expect(covered, `无案例压测字段组 ${group}`).toContain(group);
    }
  });
});
