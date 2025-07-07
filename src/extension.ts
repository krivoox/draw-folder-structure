import { statSync } from "fs";
import { basename } from "path";
import * as vscode from "vscode";
import { generateStructure } from "./functions/generate-structure";
import { getPrefix } from "./functions/get-prefix";
import { Style } from "./types/style";
import { telemetryService } from "./services/telemetry";

const CURRENT_VERSION = "1.3.0";

export function activate(context: vscode.ExtensionContext) {
  const previousVersion = context.globalState.get<string>("extensionVersion");

  // Rastrear activación de la extensión
  telemetryService.trackEvent("ExtensionActivated", {
    version: CURRENT_VERSION,
    isFirstActivation: previousVersion ? "false" : "true",
    previousVersion: previousVersion || "none",
  });

  if (previousVersion !== CURRENT_VERSION) {
    vscode.window.showInformationMessage(
      `🎉 New version ${CURRENT_VERSION} available! Check out the new features!`
    );
    context.globalState.update("extensionVersion", CURRENT_VERSION);

    // Rastrear actualización de versión
    telemetryService.trackEvent("ExtensionUpdated", {
      fromVersion: previousVersion || "unknown",
      toVersion: CURRENT_VERSION,
    });
  }

  let disposable = vscode.commands.registerCommand(
    "extension.generateMarkdownStructure",
    async (folder: vscode.Uri) => {
      const startTime = Date.now();

      try {
        const folderPath = folder.fsPath;
        const itemName = basename(folderPath);
        const stats = statSync(folderPath);
        let markdownStructure = "";

        const excludePatterns: string[] = vscode.workspace
          .getConfiguration("draw.folder.structure")
          .get<string[]>("exclude", []);

        const style: Style = vscode.workspace
          .getConfiguration("draw.folder.structure")
          .get<Style>("style", Style.EmojiDashes);

        const allowRecursion: boolean = vscode.workspace
          .getConfiguration("draw.folder.structure")
          .get<boolean>("allowRecursion", true);

        const respectGitignore: boolean = vscode.workspace
          .getConfiguration("draw.folder.structure")
          .get<boolean>("respectGitignore", false);

        if (stats.isDirectory()) {
          markdownStructure += getPrefix(0, style) + itemName + "\n";
          markdownStructure += await generateStructure(
            folderPath,
            excludePatterns,
            style,
            allowRecursion,
            respectGitignore
          );
        } else {
          markdownStructure = getPrefix(0, style, true) + itemName + "\n";
        }

        markdownStructure = "```\n" + markdownStructure + "```";

        vscode.env.clipboard.writeText(markdownStructure).then(() => {
          // Muestra una notificación
          vscode.window.showInformationMessage(
            "Markdown structure copied to clipboard!"
          );
        });

        vscode.workspace
          .openTextDocument({
            content: markdownStructure,
            language: "markdown",
          })
          .then((doc) => {
            vscode.window.showTextDocument(doc);
          });

        // Rastrear uso exitoso del comando
        const duration = Date.now() - startTime;
        telemetryService.trackEvent(
          "GenerateStructureCommand",
          {
            style: style,
            isDirectory: stats.isDirectory().toString(),
            allowRecursion: allowRecursion.toString(),
            respectGitignore: respectGitignore.toString(),
            excludePatternsCount: excludePatterns.length.toString(),
            success: "true",
          },
          {
            duration: duration,
            outputLength: markdownStructure.length,
          }
        );
      } catch (error) {
        // Rastrear errores
        const duration = Date.now() - startTime;
        telemetryService.trackException(error as Error, {
          command: "generateMarkdownStructure",
          duration: duration.toString(),
        });

        telemetryService.trackEvent(
          "GenerateStructureCommand",
          {
            success: "false",
            errorType: (error as Error).name || "UnknownError",
          },
          {
            duration: duration,
          }
        );

        // Re-lanzar el error para que VS Code lo maneje
        throw error;
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  // Rastrear desactivación de la extensión
  telemetryService.trackEvent("ExtensionDeactivated", {
    version: CURRENT_VERSION,
  });

  // Asegurar que todos los datos de telemetría se envíen
  telemetryService.flush();

  // Limpiar recursos
  telemetryService.dispose();
}
