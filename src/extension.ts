import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { generateStructure } from './functions/generate-structure';

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

export function deactivate() {}
