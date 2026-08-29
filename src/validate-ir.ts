export const CONTENT_GROUPS = [
  'subject',
  'composition',
  'lighting',
  'palette',
  'material',
  'camera',
  'style',
  'text_in_image',
  'exclusions',
] as const;

export const INTENTS = ['reproduce', 'restyle', 'style-extract'] as const;
export const LEGIBILITY = ['high', 'medium', 'low'] as const;
export const EVIDENCE = ['observed', 'inferred'] as const;

/** 除 exclusions 外的字段组，其条目均为三键结构 */
const ENTRY_GROUPS = CONTENT_GROUPS.filter((g) => g !== 'exclusions');

export type Evidence = (typeof EVIDENCE)[number];

export interface IrEntry {
  value: string | null;
  salience: number;
  evidence: Evidence;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isBlank(v: unknown): boolean {
  return typeof v !== 'string' || v.trim() === '';
}

function validateEntry(group: string, index: number, entry: unknown, errors: string[]): void {
  const at = `${group}[${index}]`;

  if (!isPlainObject(entry)) {
    errors.push(`${at}: 条目必须是对象，含 value / salience / evidence 三键`);
    return;
  }

  const { value, salience, evidence } = entry;

  if (!Number.isInteger(salience) || (salience as number) < 1 || (salience as number) > 3) {
    errors.push(`${at}: salience 必须是 1..3 的整数，实为 ${JSON.stringify(salience)}`);
  }

  if (typeof evidence !== 'string' || !(EVIDENCE as readonly string[]).includes(evidence)) {
    errors.push(`${at}: evidence 必须是 observed 或 inferred，实为 ${JSON.stringify(evidence)}`);
    return;
  }

  if (evidence === 'observed') {
    if (isBlank(value)) {
      errors.push(`${at}: evidence 为 observed 时 value 不得为 null 或空串`);
    }
  } else if (value !== null && isBlank(value)) {
    errors.push(`${at}: evidence 为 inferred 时 value 必须是非空字符串或 null`);
  }
}

export function validateIr(doc: unknown): string[] {
  const errors: string[] = [];

  if (!isPlainObject(doc)) {
    return ['文档根节点必须是对象'];
  }

  const meta = doc.meta;
  if (!isPlainObject(meta)) {
    errors.push('meta: 必须存在且为对象');
  } else {
    if (typeof meta.intent !== 'string' || !(INTENTS as readonly string[]).includes(meta.intent)) {
      errors.push(`meta.intent 必须是 ${INTENTS.join(' | ')}，实为 ${JSON.stringify(meta.intent)}`);
    }
    if (
      typeof meta.legibility !== 'string' ||
      !(LEGIBILITY as readonly string[]).includes(meta.legibility)
    ) {
      errors.push(
        `meta.legibility 必须是 ${LEGIBILITY.join(' | ')}，实为 ${JSON.stringify(meta.legibility)}`,
      );
    }
  }

  for (const group of ENTRY_GROUPS) {
    const value = doc[group];
    if (value === undefined) {
      errors.push(`${group}: 缺失，9 个内容字段组必须全部存在`);
      continue;
    }
    if (!Array.isArray(value)) {
      errors.push(`${group}: 必须是数组`);
      continue;
    }
    if (value.length === 0) {
      errors.push(`${group}: 不得为空数组，至少一个条目`);
      continue;
    }
    value.forEach((entry, i) => validateEntry(group, i, entry, errors));
  }

  const exclusions = doc.exclusions;
  if (exclusions === undefined) {
    errors.push('exclusions: 缺失，9 个内容字段组必须全部存在');
  } else if (!Array.isArray(exclusions)) {
    errors.push('exclusions: 必须是字符串数组');
  } else {
    exclusions.forEach((item, i) => {
      if (isBlank(item)) {
        errors.push(`exclusions[${i}]: 必须是非空字符串，不带元属性`);
      }
    });
  }

  return errors;
}
