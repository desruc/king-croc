import dotenv from "dotenv";
import { Shard, ShardingManager } from "discord.js";
import { resolve } from "path";
import logger from "./core/logger";
import config from "./config";

dotenv.config();

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
  logger.warn(`[ShardManager] Shard #${shardId} Disconnected`);
};

const onShardReconnect = (shardId: number) => () => {
  logger.info(`[ShardManager] Shard #${shardId} Reconnected`);
};

const onShardCreate = (shard: Shard) => {
  shardsSpawned += 1;
  shard.on("disconnect", onShardDisconnect(shard.id));
  shard.on("reconnection", onShardReconnect(shard.id));
  if (shardsSpawned === shardingManager.totalShards) {
    logger.info("[ShardManager] All shards spawned successfully.");
  }
};

shardingManager.on("shardCreate", onShardCreate).spawn({ amount: shardCount });

process.on("unhandledRejection", (e) => {
  logger.error("UNHANDLED_REJECTION: ", e);
});

process.on("uncaughtException", (e) => {
  logger.error("UNCAUGHT_EXCEPTION: ", e);
  logger.warn("NODE_WARN: ", {
    stack: "Uncaught Exception detected. Restarting..."
  });
});
