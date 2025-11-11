import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";

// Search for .env file starting from current directory and moving up
let envPath = resolve(process.cwd(), ".env");
if (!existsSync(envPath)) {
  // Try from the package directory
  envPath = resolve(__dirname, "../../../.env");
}
config({ path: envPath });
export * from "./models/Logger";
export * from "./models/Metering";
export * from "./models/Revenium";
export * from "./types/index";
export * from "./utils/index";
