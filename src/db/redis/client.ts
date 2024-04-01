import { createClient } from "@redis/client";

import { RedisConfig } from "../../types";
class RedisClient {
  private static instance: RedisClient | null = null;
  private client: any;

  private constructor() {
    this.client = createClient({ url: `redis://${RedisConfig.host}:${RedisConfig.port}` });

    this.client.on("ready", () => console.log("Redis: Connection is ready"));
    this.client.on("error", (err) => console.log("Redis: Connection error", err));
    this.client.connect().then(() => console.log("Redis: Connected"));

    if (process.env.NODE_ENV !== "dev") {
      const arg: any = "notify-keyspace-events";
      const keax: any = "KEAx";
      this.client.set(arg, keax).then((res) => {
        console.log("Redis: notify-keyspace-events", res);
      });
    }
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public getClient() {
    return this.client;
  }
}
const redis = RedisClient.getInstance().getClient();

export { redis };






