import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'extension.generateMarkdownStructure',
    (folder: vscode.Uri) => {
      const folderPath = folder.fsPath;
      const itemName = path.basename(folderPath);
      const stats = fs.statSync(folderPath);
      let markdownStructure = '';

      const excludePatterns: string[] =
        vscode.workspace
          .getConfiguration('drawfolderstructure')
          .get('exclude') || [];

      if (stats.isDirectory()) {
        markdownStructure += `└── ${itemName}\n`;
        markdownStructure += generateStructure(folderPath, 1, excludePatterns);
      } else {
        markdownStructure = `├── ${itemName}\n`;
      }

      vscode.workspace
        .openTextDocument({ content: markdownStructure, language: 'markdown' })
        .then((doc) => {
          vscode.window.showTextDocument(doc);
        });
    }
  );

  context.subscriptions.push(disposable);
}

function generateStructure(
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

function shouldExclude(name: string, patterns: string[]): boolean {
  return patterns.some((pattern) => name.includes(pattern));
}

export function deactivate() {}
