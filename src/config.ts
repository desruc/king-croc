const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  clientId: process.env.CLIENT_ID!,
  discordToken: process.env.DISCORD_TOKEN!,
  totalShards: process.env.TOTAL_SHARDS || "auto",
  guildId: process.env.GUILD_ID!,
  dbHost: process.env.DB_HOST! || "localhost",
  dbPort: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  dbUser: process.env.DB_USER! || "root",
  dbPassword: process.env.DB_PASSWORD! || "password",
  dbName: process.env.DB_NAME! || "root"
};

export default config;
