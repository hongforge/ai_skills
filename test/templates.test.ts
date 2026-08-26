import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';
import { REPO_ROOT } from './helpers/paths.js';

type PromptTemplate = {
  id: string;
  title: string;
  summary: string;
  taxonomy: Record<string, string[]>;
  variables: string[];
  prompt: string;
  checklist: string[];
  pitfalls: string[];
};

const file = path.join(REPO_ROOT, 'library', 'templates', 'catalog.yaml');
const templates = (parse(fs.readFileSync(file, 'utf8')) as { templates: PromptTemplate[] }).templates;

describe('industrial prompt templates', () => {
  it('ships 30 reusable templates with globally unique ids', () => {
    expect(templates).toHaveLength(30);
    expect(new Set(templates.map((entry) => entry.id)).size).toBe(templates.length);
  });

  it.each(templates)('$id includes a complete reusable prompt contract', (entry) => {
    expect(entry.title).toBeTruthy();
    expect(entry.summary).toBeTruthy();
    expect(entry.prompt).toContain('{{');
    expect(entry.variables.length).toBeGreaterThan(0);
    expect(entry.taxonomy.deliverable.length).toBeGreaterThan(0);
    expect(entry.taxonomy.workflow.length).toBeGreaterThan(0);
    expect(entry.taxonomy.capability.length).toBeGreaterThan(0);
    expect(entry.taxonomy.model.length).toBeGreaterThan(0);
    expect(entry.checklist.length).toBeGreaterThan(1);
    expect(entry.pitfalls.length).toBeGreaterThan(1);
  });
});
