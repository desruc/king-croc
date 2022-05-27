// eslint-disable-next-line import/no-extraneous-dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from "discord.js";
import { PrefixedCommand, SlashCommand } from "../core/commandCollection";

const commandName = "flip";
const commandDescription = "flip a coin";

const commandDefinition = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(commandDescription);

const flipCoin = () => (Math.random() > 0.5 ? "Tails" : "Heads");

const executeSlashCommand = async (interaction: CommandInteraction) => {
  interaction.reply(flipCoin());
};

export const slashCommand: SlashCommand = {
  data: commandDefinition,
  execute: executeSlashCommand
};

const executeLegacyCommand = async (message: Message) => {
  message.channel.send(flipCoin());
};

export const prefixedCommand: PrefixedCommand = {
  name: commandName,
  execute: executeLegacyCommand
};
