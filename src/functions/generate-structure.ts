import * as fs from 'fs';
import * as path from 'path';
import { getPrefix } from './get-prefix';
import { Style } from '../types/style';
import { shouldExclude } from './should-exclude';

export function generateStructure(
  folderPath: string,
  depth: number,
  excludePatterns: string[],
  style: Style,
  isLast = false
): string {
  let structure = '';
  const items = fs
    .readdirSync(folderPath)
    .filter((item) => !shouldExclude(item, excludePatterns));
  const totalItems = items.length;

  items.forEach((item, index) => {
    const isLastItem = index === totalItems - 1;
    const fullPath = path.join(folderPath, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      const subItems = fs
        .readdirSync(fullPath)
        .filter((subItem) => !shouldExclude(subItem, excludePatterns));
      const isSubLast = isLastItem && subItems.length === 0;
      structure += getPrefix(depth, style, false, isSubLast) + item + '\n';
      structure += generateStructure(
        fullPath,
        depth + 1,
        excludePatterns,
        style,
        isLastItem
      );
    } else {
      structure +=
        getPrefix(depth, style, true, isLastItem && isLast) + item + '\n';
    }
  });

  return structure;
}
