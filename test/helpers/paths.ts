import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(here, '..', '..');
export const SKILL_DIR = path.join(REPO_ROOT, 'skills', 'img2prompt');
export const REFERENCES_DIR = path.join(SKILL_DIR, 'references');
export const EXAMPLES_DIR = path.join(SKILL_DIR, 'examples');
