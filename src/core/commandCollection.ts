import { readdirSync } from "fs";
import { resolve } from "path";
import { Collection } from "discord.js";

export interface SlashCommand {
  data:
    | import("@discordjs/builders").SlashCommandBuilder
    | Omit<
        import("@discordjs/builders").SlashCommandBuilder,
        "addSubcommand" | "addSubcommandGroup"
      >;
  execute: (interaction: import("discord.js").CommandInteraction) => Promise<void>;
}

export interface PrefixedCommand {
  name: string;
  execute: (message: import("discord.js").Message) => Promise<void>;
}
export const slashCommandCollection = new Collection<string, SlashCommand>();
export const prefixedCommandCollection = new Collection<string, PrefixedCommand>();

const commandFiles: string[] = readdirSync(`${__dirname}/../commands/`);
const commandPath = resolve(__dirname, "..", "commands");

commandFiles.forEach((file) => {
  // eslint-disable-next-line
  const { slashCommand, prefixedCommand } = require(`${commandPath}/${file}`);

  if (slashCommand) slashCommandCollection.set(slashCommand.data.name, slashCommand);
  if (prefixedCommand)
    prefixedCommandCollection.set(prefixedCommand.name, prefixedCommand);
});
