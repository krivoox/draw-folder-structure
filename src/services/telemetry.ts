import * as appInsights from "applicationinsights";
import * as vscode from "vscode";
import * as dotenv from "dotenv";
import * as path from "path";

class TelemetryService {
  private client: appInsights.TelemetryClient | null = null;
  private isEnabled: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    const envPath = path.join(__dirname, "..", "..", ".env");
    dotenv.config({ path: envPath });
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      const connectionString = this.getConnectionString();

      if (connectionString) {
        appInsights
          .setup(connectionString)
          .setAutoCollectRequests(false)
          .setAutoCollectPerformance(false, false)
          .setAutoCollectExceptions(true)
          .setAutoCollectDependencies(false)
          .setAutoCollectConsole(false, false)
          .setAutoCollectPreAggregatedMetrics(false)
          .setSendLiveMetrics(false)
          .setInternalLogging(false, false)
          .start();

        this.client = appInsights.defaultClient;
        this.isEnabled = true;

        this.client.commonProperties = {
          "extension.name": "drawfolderstructure",
          "extension.version":
            vscode.extensions.getExtension("jmkrivocapich.drawfolderstructure")
              ?.packageJSON.version || "unknown",
          "vscode.version": vscode.version,
          "vscode.language": vscode.env.language,
          "os.platform": process.platform,
          "os.arch": process.arch,
        };

        await new Promise((resolve) => setTimeout(resolve, 1000));

        this.isInitialized = true;

        this.trackEvent("TelemetryServiceInitialized", {
          initializationTime: new Date().toISOString(),
          hasClient: (!!this.client).toString(),
        });
      } else {
        this.isEnabled = false;
      }
    } catch (error) {
      this.isEnabled = false;
    }
  }

  private getConnectionString(): string | undefined {
    const envConnectionString = process.env.AZURE_INSIGHTS_CONNECTION_STRING;
    return envConnectionString;
  }

  public trackEvent(
    eventName: string,
    properties?: { [key: string]: string },
    measurements?: { [key: string]: number }
  ): void {
    if (this.isEnabled && this.client) {
      try {
        const enhancedProperties = {
          timestamp: new Date().toISOString(),
          ...(properties || {}),
        };

        this.client.trackEvent({
          name: eventName,
          properties: enhancedProperties,
          measurements: measurements,
        });
      } catch (error) {
        // Silently fail
      }
    }
  }

  public trackException(
    exception: Error,
    properties?: { [key: string]: string }
  ): void {
    if (this.isEnabled && this.client) {
      try {
        this.client.trackException({
          exception: exception,
          properties: properties,
        });
      } catch (error) {
        // Silently fail
      }
    }
  }

  public trackMetric(
    name: string,
    value: number,
    properties?: { [key: string]: string }
  ): void {
    if (this.isEnabled && this.client) {
      try {
        this.client.trackMetric({
          name: name,
          value: value,
          properties: properties,
        });
      } catch (error) {
        // Silently fail
      }
    }
  }

  public flush(): void {
    if (this.isEnabled && this.client) {
      this.client.flush();
    }
  }

  public dispose(): void {
    if (this.isEnabled && this.client) {
      this.client.flush();
      appInsights.dispose();
    }
  }
}

export const telemetryService = new TelemetryService();
