const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  clientId: process.env.CLIENT_ID!,
  discordToken: process.env.DISCORD_TOKEN!,
  totalShards: process.env.TOTAL_SHARDS || "auto",
  guildId: process.env.GUILD_ID!
};

export default config;
