import { statSync } from "fs";
import { basename } from "path";
import * as vscode from "vscode";
import { generateStructure } from "./functions/generate-structure";
import { getPrefix } from "./functions/get-prefix";
import { Style } from "./types/style";
import {
  TelemetryService,
  PerformanceTracker,
} from "./functions/telemetry-service";

const CURRENT_VERSION = "1.4.1";

export function activate(context: vscode.ExtensionContext) {
  // Inicializar el servicio de telemetría
  const telemetryService = TelemetryService.getInstance();
  telemetryService.initialize();

  // Rastrear activación de la extensión
  telemetryService.trackEvent("extension.activated", {
    version: CURRENT_VERSION,
    firstTime:
      context.globalState.get<string>("extensionVersion") !== CURRENT_VERSION
        ? "true"
        : "false",
  });

  const previousVersion = context.globalState.get<string>("extensionVersion");

  if (previousVersion !== CURRENT_VERSION) {
    vscode.window.showInformationMessage(
      `🎉 New version ${CURRENT_VERSION} available! Check out the new features!`
    );
    context.globalState.update("extensionVersion", CURRENT_VERSION);

    // Rastrear actualización de versión
    telemetryService.trackEvent("extension.version_updated", {
      previousVersion: previousVersion || "unknown",
      newVersion: CURRENT_VERSION,
    });
  }

  let disposable = vscode.commands.registerCommand(
    "extension.generateMarkdownStructure",
    async (folder: vscode.Uri) => {
      const performanceTracker = new PerformanceTracker(
        "command.generateMarkdownStructure"
      );

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

        // Rastrear configuración utilizada
        telemetryService.trackEvent("command.configuration_used", {
          style: style,
          allowRecursion: allowRecursion.toString(),
          respectGitignore: respectGitignore.toString(),
          excludePatternsCount: excludePatterns.length.toString(),
          isDirectory: stats.isDirectory().toString(),
        });

        if (stats.isDirectory()) {
          markdownStructure += getPrefix(0, style) + itemName + "\n";

          const structureStartTime = Date.now();
          markdownStructure += await generateStructure(
            folderPath,
            excludePatterns,
            style,
            allowRecursion,
            respectGitignore
          );
          const structureElapsedTime = Date.now() - structureStartTime;

          // Rastrear métricas de generación de estructura
          telemetryService.trackMetric(
            "structure.generation_time",
            structureElapsedTime,
            {
              style: style,
              allowRecursion: allowRecursion.toString(),
            }
          );
        } else {
          markdownStructure = getPrefix(0, style, true) + itemName + "\n";
        }

        markdownStructure = "```\n" + markdownStructure + "```";

        // Rastrear métricas del contenido generado
        telemetryService.trackMetric(
          "structure.content_length",
          markdownStructure.length
        );
        telemetryService.trackMetric(
          "structure.line_count",
          markdownStructure.split("\n").length
        );

        vscode.env.clipboard.writeText(markdownStructure).then(() => {
          // Muestra una notificación
          vscode.window.showInformationMessage(
            "Markdown structure copied to clipboard!"
          );

          // Rastrear éxito en copia al portapapeles
          telemetryService.trackEvent("clipboard.copy_success");
        });

        vscode.workspace
          .openTextDocument({
            content: markdownStructure,
            language: "markdown",
          })
          .then((doc) => {
            vscode.window.showTextDocument(doc);

            // Rastrear apertura exitosa del documento
            telemetryService.trackEvent("document.opened_successfully");
          });

        performanceTracker.finish(true, {
          contentLength: markdownStructure.length.toString(),
          lineCount: markdownStructure.split("\n").length.toString(),
        });
      } catch (error) {
        // Rastrear errores
        telemetryService.trackException(error as Error, {
          command: "generateMarkdownStructure",
        });

        performanceTracker.finish(false, {
          error: (error as Error).message,
        });

        vscode.window.showErrorMessage(
          `Error generating structure: ${(error as Error).message}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  // Rastrear desactivación y hacer flush de datos pendientes
  const telemetryService = TelemetryService.getInstance();
  telemetryService.trackEvent("extension.deactivated");
  telemetryService.flush();
}
