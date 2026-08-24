import { describe, it, expect } from 'vitest';
import { validateIr, CONTENT_GROUPS } from '../src/validate-ir.js';

// 返回 Record<string, any>，使负面用例可以直接赋非法值而无需类型断言
function validDoc(): Record<string, any> {
  return {
    meta: { intent: 'reproduce', legibility: 'high' },
    subject: [{ value: '一只柯基犬，坐姿，正面朝向镜头', salience: 1, evidence: 'observed' }],
    composition: [{ value: '中景，平视机位，三分法右置', salience: 1, evidence: 'observed' }],
    lighting: [{ value: '左上 45° 硬质主光', salience: 1, evidence: 'observed' }],
    palette: [{ value: '暖棕主色，米白背景', salience: 2, evidence: 'observed' }],
    material: [{ value: '短毛，哑光表面', salience: 2, evidence: 'observed' }],
    camera: [{ value: null, salience: 3, evidence: 'inferred' }],
    style: [{ value: '棚拍商业摄影', salience: 2, evidence: 'inferred' }],
    // 「确认无文字」是一个观察结果，写成文字；null 专用于「无法判断」
    text_in_image: [{ value: '画面内无文字', salience: 3, evidence: 'observed' }],
    exclusions: ['文字', '水印'],
  };
}

describe('validateIr', () => {
  it('接受合法文档', () => {
    expect(validateIr(validDoc())).toEqual([]);
  });

  it('导出 9 个内容字段组，顺序固定', () => {
    expect(CONTENT_GROUPS).toEqual([
      'subject', 'composition', 'lighting', 'palette', 'material',
      'camera', 'style', 'text_in_image', 'exclusions',
    ]);
  });

  it('拒绝非对象', () => {
    expect(validateIr(null).length).toBeGreaterThan(0);
    expect(validateIr('x').length).toBeGreaterThan(0);
  });

  it('缺失内容字段组时报错，并指出组名', () => {
    const doc = validDoc();
    delete doc.lighting;
    const errors = validateIr(doc);
    expect(errors.some((e) => e.includes('lighting'))).toBe(true);
  });

  it('拒绝非法 intent', () => {
    const doc = validDoc();
    doc.meta.intent = 'remix';
    expect(validateIr(doc).some((e) => e.includes('intent'))).toBe(true);
  });

  it('拒绝非法 legibility', () => {
    const doc = validDoc();
    doc.meta.legibility = 'perfect';
    expect(validateIr(doc).some((e) => e.includes('legibility'))).toBe(true);
  });

  it('拒绝越界 salience', () => {
    const doc = validDoc();
    doc.subject[0].salience = 4;
    expect(validateIr(doc).some((e) => e.includes('salience'))).toBe(true);
  });

  it('拒绝非整数 salience', () => {
    const doc = validDoc();
    doc.subject[0].salience = 1.5;
    expect(validateIr(doc).some((e) => e.includes('salience'))).toBe(true);
  });

  it('拒绝非法 evidence', () => {
    const doc = validDoc();
    doc.subject[0].evidence = 'guessed';
    expect(validateIr(doc).some((e) => e.includes('evidence'))).toBe(true);
  });

  it('observed 条目的 value 不得为 null', () => {
    const doc = validDoc();
    doc.subject[0].value = null;
    expect(validateIr(doc).some((e) => e.includes('observed'))).toBe(true);
  });

  it('observed 条目的 value 不得为空串', () => {
    const doc = validDoc();
    doc.subject[0].value = '   ';
    expect(validateIr(doc).some((e) => e.includes('observed'))).toBe(true);
  });

  it('inferred 条目的 value 允许为 null', () => {
    const doc = validDoc();
    doc.style[0].value = null;
    expect(validateIr(doc)).toEqual([]);
  });

  // null 表示「无法判断」，不表示「确认不存在」。
  // 「确认不存在」是观察结果，必须写成文字并标 observed。
  it('区分「无法判断」与「确认不存在」', () => {
    const unknown = validDoc();
    unknown.text_in_image = [{ value: null, salience: 3, evidence: 'inferred' }];
    expect(validateIr(unknown), 'null + inferred 表示无法判断，应合法').toEqual([]);

    const absent = validDoc();
    absent.text_in_image = [{ value: '画面内无文字', salience: 3, evidence: 'observed' }];
    expect(validateIr(absent), 'observed + 文字表示确认不存在，应合法').toEqual([]);

    const wrong = validDoc();
    wrong.text_in_image = [{ value: null, salience: 3, evidence: 'observed' }];
    expect(validateIr(wrong).length, 'null + observed 语义矛盾，应拒绝').toBeGreaterThan(0);
  });

  it('拒绝空的字段组数组', () => {
    const doc = validDoc();
    doc.subject = [];
    expect(validateIr(doc).some((e) => e.includes('subject'))).toBe(true);
  });

  it('exclusions 必须是字符串数组，不带元属性', () => {
    const doc = validDoc();
    doc.exclusions = [{ value: '文字', salience: 1, evidence: 'observed' }];
    expect(validateIr(doc).some((e) => e.includes('exclusions'))).toBe(true);
  });

  it('exclusions 拒绝空串', () => {
    const doc = validDoc();
    doc.exclusions = [''];
    expect(validateIr(doc).some((e) => e.includes('exclusions'))).toBe(true);
  });

  it('exclusions 允许为空数组', () => {
    const doc = validDoc();
    doc.exclusions = [];
    expect(validateIr(doc)).toEqual([]);
  });

  it('累积报告多个错误，不在首个错误处停止', () => {
    const doc = validDoc();
    doc.subject[0].salience = 9;
    doc.lighting[0].evidence = 'guessed';
    expect(validateIr(doc).length).toBeGreaterThanOrEqual(2);
  });
});
