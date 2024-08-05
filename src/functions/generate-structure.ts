import * as path from 'path';
import * as vscode from 'vscode';
import { Style } from '../types/style';
import { getPrefix } from './get-prefix';

export async function generateStructure(
  folderPath: string,
  excludePatterns: string[],
  style: Style,
  isLast = false
): Promise<string> {
  let structure = '';

  const globPatterns = `{${excludePatterns.join(',')}}`;

  const files = (
    await vscode.workspace.findFiles(
      new vscode.RelativePattern(folderPath, '**/*'),
      new vscode.RelativePattern(folderPath, globPatterns)
    )
  ).sort((a, b) => a.fsPath.localeCompare(b.fsPath));

  const folders = new Set([folderPath]);

  for (const [index, file] of files.entries()) {
    const isLastItem = isLast && index === files.length - 1;
    const fullPath = path.parse(file.fsPath).dir;
    const itemName = path.basename(file.fsPath);

    const currentDepth =
      fullPath.split(path.sep).length - folderPath.split(path.sep).length;

    if (!folders.has(fullPath)) {
      folders.add(fullPath);

      const folderName = path.basename(fullPath);

      structure +=
        getPrefix(currentDepth, style, false, isLastItem) + folderName + '\n';
    }

    structure +=
      getPrefix(currentDepth + 1, style, true, isLastItem) + itemName + '\n';
  }

  return structure;
}
