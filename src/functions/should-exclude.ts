import { minimatch } from "minimatch";
import * as path from "path";

export function shouldExclude(
  name: string,
  patterns: string[],
  basePath: string
): boolean {
  const fullPath = path.join(basePath, name);

  return patterns.some((pattern) => minimatch(fullPath, pattern));
}
