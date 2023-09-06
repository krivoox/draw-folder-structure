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

      if (stats.isDirectory()) {
        markdownStructure += `└── ${itemName}\n`;
        markdownStructure += generateStructure(folderPath, 1);
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
  isFile: boolean = false
): string {
  const indent = '  '.repeat(depth);
  let structure = '';

  if (isFile) {
    return `${indent}├── ${path.basename(dir)}\n`;
  }

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      structure += `${indent}└── ${item}\n`;
      structure += generateStructure(itemPath, depth + 1);
    } else {
      structure += generateStructure(itemPath, depth + 1, true);
    }
  }

  return structure;
}

export function deactivate() {}
