import dotenv from "dotenv";
import { Shard, ShardingManager } from "discord.js";
import { resolve } from "path";
import config from "./config";
import initDb from "./db";

dotenv.config();

initDb();

const { totalShards, discordToken } = config;

const shardCount: number | "auto" =
  totalShards === "auto" ? totalShards : Number(totalShards);

let shardsSpawned = 0;

const shardingManager = new ShardingManager(
  resolve(__dirname, config.nodeEnv === "development" ? "client.ts" : "client.js"),
  {
    totalShards: shardCount,
    mode: "worker",
    respawn: true,
    token: discordToken
  }
);

const onShardDisconnect = (shardId: number) => () => {
  console.warn(`[ShardManager] Shard #${shardId} Disconnected`);
};

const onShardReconnect = (shardId: number) => () => {
  console.info(`[ShardManager] Shard #${shardId} Reconnected`);
};

const onShardCreate = (shard: Shard) => {
  shardsSpawned += 1;
  shard.on("disconnect", onShardDisconnect(shard.id));
  shard.on("reconnection", onShardReconnect(shard.id));
  if (shardsSpawned === shardingManager.totalShards) {
    console.info("[ShardManager] All shards spawned successfully.");
  }
};

shardingManager.on("shardCreate", onShardCreate).spawn({ amount: shardCount });

process.on("unhandledRejection", (e) => {
  console.error("UNHANDLED_REJECTION: ", e);
});

process.on("uncaughtException", (e) => {
  console.error("UNCAUGHT_EXCEPTION: ", e);
  console.warn("NODE_WARN: ", {
    stack: "Uncaught Exception detected. Restarting..."
  });
});
