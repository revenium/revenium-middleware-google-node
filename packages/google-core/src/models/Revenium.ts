import { logger } from "./Logger";
import { IModel } from "../types/model";

export class Revenium {
  constructor(private readonly type: IModel = "google") {}

  verifyEnvironment(): void {
    const reveniumMeteringApiKey = process.env.REVENIUM_METERING_API_KEY;
    const reveniumMeteringBaseUrl = process.env.REVENIUM_METERING_BASE_URL;

    if (!reveniumMeteringApiKey) {
      logger.error("REVENIUM_METERING_API_KEY is not set");
      return;
    }

    if (!reveniumMeteringBaseUrl) {
      logger.debug(
        "REVENIUM_METERING_BASE_URL is not set; defaulting to https://api.revenium.ai"
      );
    }

    if (this.type === "google") {
      if (!process.env.GOOGLE_API_KEY) {
        logger.error("GOOGLE_API_KEY is not set");
      }
      return;
    }

    if (this.type === "vertex") {
      if (!process.env.GOOGLE_CLOUD_PROJECT) {
        logger.error("GOOGLE_CLOUD_PROJECT is not set");
      }

      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        logger.error("GOOGLE_APPLICATION_CREDENTIALS is not set");
      }

      if (!process.env.GOOGLE_CLOUD_LOCATION) {
        logger.warning(
          "GOOGLE_CLOUD_LOCATION is not set; defaulting to us-central1"
        );
      }
    }
  }
}
