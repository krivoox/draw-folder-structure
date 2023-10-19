import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function linkToURL() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const selection = editor.selection;
  const code = editor.document.getText(selection);
  const filePath = editor.document.uri.fsPath;

  const url = await vscode.window.showInputBox({ prompt: 'Ingrese la URL:' });
  if (!url) {
    return;
  }

  const name = await vscode.window.showInputBox({
    prompt: 'Ingrese un nombre para el enlace:',
  });
  if (!name) {
    return;
  }

  const workspaceFolder = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : undefined;
  if (!workspaceFolder) {
    // Manejar el caso en que no hay una carpeta de espacio de trabajo abierta
    return;
  }

  // Guardar en codeLinks.json
  const vscodeFolder = path.join(workspaceFolder, '.vscode');
  const linksFile = path.join(vscodeFolder, 'codeLinks.json');

  let links: { [key: string]: any } = {};
  if (fs.existsSync(linksFile)) {
    links = JSON.parse(fs.readFileSync(linksFile, 'utf-8'));
  }

  if (!links[filePath]) {
    links[filePath] = {};
  }

  links[filePath][code] = { url, name };
  fs.writeFileSync(linksFile, JSON.stringify(links, null, 4));
  vscode.commands.executeCommand('editor.action.codeLens.show');
}
