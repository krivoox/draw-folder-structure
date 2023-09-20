import * as fs from 'fs';
import * as path from 'path';
import { shouldExclude } from './should-exclude';

export function generateStructure(
  dir: string,
  depth: number = 0,
  excludePatterns: string[] = []
): string {
  const indent = '  '.repeat(depth);
  let structure = '';

  const items = fs
    .readdirSync(dir)
    .filter((item) => !shouldExclude(item, excludePatterns));
  items.forEach((item, index) => {
    const isLastItem = index === items.length - 1;
    const prefix = isLastItem ? '└── ' : '├── ';

    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      structure += `${indent}${prefix}${item}\n`;
      structure += generateStructure(itemPath, depth + 1, excludePatterns);
    } else {
      structure += `${indent}${prefix}${item}\n`;
    }
  });

  return structure;
}
