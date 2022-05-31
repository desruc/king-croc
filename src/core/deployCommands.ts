/* eslint-disable */
import dotenv from "dotenv";

import { readdirSync } from "fs";
import { resolve } from "path";
import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v9";
import config from "../config";
import { SlashCommand } from "./commandCollection";

dotenv.config();

const { clientId, discordToken, guildId } = config;

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const commandFiles: string[] = readdirSync(`${__dirname}/../commands/`);
const commandPath = resolve(__dirname, "..", "commands");

commandFiles.forEach((file) => {
  // eslint-disable-next-line
  const { slashCommand } = require(`${commandPath}/${file}`);
  commands.push(slashCommand.data.toJSON());
});

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
