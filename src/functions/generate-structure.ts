import * as fs from "fs";
import * as path from "path";
import { getPrefix } from "./get-prefix";
import { Style } from "../types/style";
import { shouldExclude } from "./should-exclude";

export function generateStructure(
  folderPath: string,
  depth: number,
  excludePatterns: string[],
  style: Style,
  isLast = false
): string {
  let structure = "";

  const items = fs
    .readdirSync(folderPath)
    .filter((item) => {
      const itemPath = path.join(folderPath, item);
      return !shouldExclude(itemPath, excludePatterns, folderPath);
    })
    .sort((a, b) => {
      const aPath = path.join(folderPath, a);
      const bPath = path.join(folderPath, b);
      const aIsDirectory = fs.lstatSync(aPath).isDirectory();
      const bIsDirectory = fs.lstatSync(bPath).isDirectory();
      if (aIsDirectory && !bIsDirectory) return -1;
      if (!aIsDirectory && bIsDirectory) return 1;
      return a.localeCompare(b);
    });

  const totalItems = items.length;

  items.forEach((item, index) => {
    const isLastItem = index === totalItems - 1;
    const fullPath = path.join(folderPath, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      const subItems = fs
        .readdirSync(fullPath)
        .filter(
          (subItem) => !shouldExclude(subItem, excludePatterns, folderPath)
        );
      const isSubLast = isLastItem && subItems.length === 0;
      structure += getPrefix(depth, style, false, isSubLast) + item + "\n";
      structure += generateStructure(
        fullPath,
        depth + 1,
        excludePatterns,
        style,
        isLastItem
      );
    } else {
      structure +=
        getPrefix(depth, style, true, isLastItem && isLast) + item + "\n";
    }
  });

  return structure;
}
