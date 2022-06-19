import { Message } from "discord.js";
import logger from "../core/logger";
import Bot, { DiscordEvent } from "../core/bot";

class MessageCreate implements DiscordEvent {
  readonly client;

  readonly name = "messageCreate";

  constructor(private bot: Bot) {
    this.client = bot;
  }

  public async exec(message: Message): Promise<void> {
    const prefix = "!";

    const isPotentialCommand = message.content.startsWith(prefix);

    if (isPotentialCommand) {
      const potentialCommand = message.content.slice(1);

      const command = this.bot.prefixedCommands.get(potentialCommand);

      if (!command) return;

      try {
        await command.execute(message);
      } catch (error) {
        logger.error(error);
        await message.reply({
          content: "My apologies! There was an error executing the command..."
        });
      }
    }
  }
}

export default MessageCreate;
