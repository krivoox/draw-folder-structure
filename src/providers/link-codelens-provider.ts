import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class LinkCodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const workspaceFolder = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;
    if (!workspaceFolder) {
      // ! Manejar el caso en que no hay una carpeta de espacio de trabajo abierta
      return [];
    }

    // Guardar en codeLinks.json
    const vscodeFolder = path.join(workspaceFolder, '.vscode');
    const linksFile = path.join(vscodeFolder, 'codeLinks.json');

    if (!fs.existsSync(linksFile)) {
      fs.mkdirSync(vscodeFolder);
      return [];
    }

    const links = JSON.parse(fs.readFileSync(linksFile, 'utf-8'));
    const filePath = document.uri.fsPath;
    const codeLinks = links[filePath];
    if (!codeLinks) {
      return [];
    }

    const lenses = [];
    for (const code in codeLinks) {
      const pos = document.getText().indexOf(code);
      if (pos === -1) {
        continue;
      }

      const range = new vscode.Range(
        document.positionAt(pos),
        document.positionAt(pos + code.length)
      );
      const lens = new vscode.CodeLens(range, {
        title: `@~ ${codeLinks[code].name}`,
        command: 'extension.openUrl',
        arguments: [codeLinks[code].url],
      });
      lenses.push(lens);
    }

    return lenses;
  }
}
