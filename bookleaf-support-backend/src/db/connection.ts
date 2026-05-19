import mongoose, { ConnectOptions } from "mongoose";
import { config } from "../config/env";
import { logger } from "../utils/logger";

export type DbStatus = "connected" | "disconnected" | "connecting" | "disconnecting";

const READY_STATE_MAP: Record<number, DbStatus> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export class DataBase {
  private static instance: DataBase | undefined = undefined;
  public connection: mongoose.Connection | undefined;

  private constructor() {
    this.connection = undefined;
  }

  public static getDatabaseConnection(): mongoose.Connection | undefined {
    if (DataBase.instance === undefined) {
      DataBase.instance = new DataBase();
      DataBase.instance.spawnConnection();
    }
    return DataBase.instance.connection;
  }

  private spawnConnection(): void {
    const options: ConnectOptions = {
      serverSelectionTimeoutMS: 5000,
    };

    mongoose.connect(config.MONGO_URI, options).catch((err: Error) => {
      logger.error({ err: err.message }, "Initial MongoDB connection failed");
    });

    this.connection = mongoose.connection;

    this.connection.on("open", () => {
      logger.info("MongoDB connection established");
    });
    this.connection.on("close", () => {
      logger.warn("MongoDB connection closed");
    });
    this.connection.on("error", (err: Error) => {
      logger.error({ err: err.message }, "MongoDB connection error");
    });
    this.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });
    this.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });
  }

  public static async disconnect(): Promise<void> {
    if (DataBase.instance?.connection) {
      await mongoose.disconnect();
      DataBase.instance = undefined;
    }
  }
}

export const getDbStatus = (): DbStatus => {
  const state = mongoose.connection.readyState;
  return READY_STATE_MAP[state] ?? "disconnected";
};
