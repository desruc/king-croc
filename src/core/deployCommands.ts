/* eslint-disable */
import dotenv from "dotenv";

import { readdirSync } from "fs";
import { resolve } from "path";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "../config";
import { SlashCommand } from "./commandCollection";

dotenv.config();

const { clientId, discordToken, guildId } = config;

const commands = [];
const commandFiles: string[] = readdirSync(`${__dirname}/../commands/`);
const commandPath = resolve(__dirname, "..", "commands");

for (const file of commandFiles) {
  const command: SlashCommand = require(`${commandPath}/${file}`).default;
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(discordToken);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
