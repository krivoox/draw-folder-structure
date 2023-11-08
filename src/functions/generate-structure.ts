import * as fs from 'fs';
import * as path from 'path';
import { Style, getPrefix } from './get-prefix';

export function generateStructure(
  folderPath: string,
  depth: number,
  excludePatterns: string[],
  style: Style
): string {
  let structure = '';
  const items = fs.readdirSync(folderPath);

  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const stats = fs.statSync(fullPath);
    const isFile = stats.isFile();
    const isExcluded = excludePatterns.some((pattern) =>
      new RegExp(pattern).test(item)
    );

    if (!isExcluded) {
      structure += getPrefix(depth, style, isFile) + item + '\n';
      if (stats.isDirectory()) {
        structure += generateStructure(
          fullPath,
          depth + 1,
          excludePatterns,
          style
        );
      }
    }
  }

  return structure;
}
