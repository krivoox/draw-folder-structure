import * as appInsights from "applicationinsights";
import * as vscode from "vscode";

export class TelemetryService {
  private static instance: TelemetryService;
  private isInitialized = false;
  private client?: appInsights.TelemetryClient;

  // Clave de instrumentación interna del desarrollador
  private readonly INSTRUMENTATION_KEY =
    process.env.APPINSIGHTS_INSTRUMENTATIONKEY || "";

  private constructor() {}

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  public initialize(): void {
    try {
      const config = vscode.workspace.getConfiguration("draw.folder.structure");
      const isEnabled = config.get<boolean>("telemetry.enabled", true);

      if (!isEnabled) {
        console.log("Telemetry is disabled by user configuration");
        return;
      }

      if (!this.INSTRUMENTATION_KEY) {
        console.log("No instrumentation key available for telemetry");
        return;
      }

      // Configurar Application Insights
      appInsights
        .setup(this.INSTRUMENTATION_KEY)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(false) // No necesario para extensiones
        .setAutoCollectPerformance(true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(false) // No necesario para extensiones
        .setUseDiskRetryCaching(true)
        .start();

      this.client = appInsights.defaultClient;
      this.isInitialized = true;

      // Configurar propiedades globales
      this.client.commonProperties = {
        extensionVersion: this.getExtensionVersion(),
        vscodeVersion: vscode.version,
        platform: process.platform,
        nodeVersion: process.version,
      };

      console.log("Telemetry service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize telemetry service:", error);
    }
  }

  public trackEvent(
    eventName: string,
    properties?: { [key: string]: string },
    measurements?: { [key: string]: number }
  ): void {
    if (!this.isInitialized || !this.client) {
      return;
    }

    try {
      this.client.trackEvent({
        name: eventName,
        properties: properties,
        measurements: measurements,
      });
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  }

  public trackException(
    error: Error,
    properties?: { [key: string]: string }
  ): void {
    if (!this.isInitialized || !this.client) {
      return;
    }

    try {
      this.client.trackException({
        exception: error,
        properties: properties,
      });
    } catch (err) {
      console.error("Failed to track exception:", err);
    }
  }

  public trackMetric(
    name: string,
    value: number,
    properties?: { [key: string]: string }
  ): void {
    if (!this.isInitialized || !this.client) {
      return;
    }

    try {
      this.client.trackMetric({
        name: name,
        value: value,
        properties: properties,
      });
    } catch (error) {
      console.error("Failed to track metric:", error);
    }
  }

  public trackDependency(
    name: string,
    commandName: string,
    elapsedTime: number,
    success: boolean,
    properties?: { [key: string]: string }
  ): void {
    if (!this.isInitialized || !this.client) {
      return;
    }

    try {
      this.client.trackDependency({
        name: name,
        data: commandName,
        duration: elapsedTime,
        success: success,
        dependencyTypeName: "Extension Command",
        resultCode: success ? "200" : "500",
        properties: properties,
      });
    } catch (error) {
      console.error("Failed to track dependency:", error);
    }
  }

  public flush(): void {
    if (!this.isInitialized || !this.client) {
      return;
    }

    try {
      this.client.flush();
    } catch (error) {
      console.error("Failed to flush telemetry:", error);
    }
  }

  private getExtensionVersion(): string {
    try {
      const packageJson = require("../../package.json");
      return packageJson.version || "unknown";
    } catch {
      return "unknown";
    }
  }
}

// Utilidad para medir el tiempo de ejecución
export class PerformanceTracker {
  private startTime: number;
  private eventName: string;
  private properties?: { [key: string]: string };

  constructor(eventName: string, properties?: { [key: string]: string }) {
    this.startTime = Date.now();
    this.eventName = eventName;
    this.properties = properties;
  }

  public finish(
    success: boolean = true,
    additionalProperties?: { [key: string]: string }
  ): void {
    const elapsedTime = Date.now() - this.startTime;
    const telemetry = TelemetryService.getInstance();

    const allProperties = {
      ...this.properties,
      ...additionalProperties,
      success: success.toString(),
    };

    telemetry.trackEvent(this.eventName, allProperties, { elapsedTime });
    telemetry.trackMetric(
      `${this.eventName}.duration`,
      elapsedTime,
      allProperties
    );
  }
}
