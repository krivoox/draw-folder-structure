import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { generateStructure } from './functions/generate-structure';
import { linkToURL } from './functions/link-to-url';
import { LinkCodeLensProvider } from './providers/link-codelens-provider';

export function activate(context: vscode.ExtensionContext) {
  vscode.commands.executeCommand('editor.action.codeLens.show');

  vscode.workspace.onDidChangeWorkspaceFolders(() => {
    vscode.commands.executeCommand('editor.action.codeLens.show');
  });

  let markdownStructureCommand = vscode.commands.registerCommand(
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

  let linkCommand = vscode.commands.registerCommand(
    'extension.linkWithUrl',
    async () => linkToURL()
  );

  let openUrlCommand = vscode.commands.registerCommand(
    'extension.openUrl',
    (url: string) => {
      vscode.env.openExternal(vscode.Uri.parse(url));
    }
  );

  const codeLensProvider = vscode.languages.registerCodeLensProvider(
    { pattern: '**/*.{ts,js,jsx,tsx}' },
    new LinkCodeLensProvider()
  );

  context.subscriptions.push(
    markdownStructureCommand,
    linkCommand,
    openUrlCommand,
    codeLensProvider
  );
}

export function deactivate() {}
