import { Message } from "discord.js";
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
    console.log(
      "🚀 ~ file: messageCreate.ts ~ line 17 ~ MessageCreate ~ exec ~ isPotentialCommand",
      isPotentialCommand
    );

    if (isPotentialCommand) {
      const potentialCommand = message.content.slice(1);

      const command = this.bot.prefixedCommands.get(potentialCommand);

      if (!command) return;

      try {
        await command.execute(message);
      } catch (error) {
        console.error(error);
        await message.reply({
          content: "My apologies! There was an error executing the command..."
        });
      }
    }
  }
}

export default MessageCreate;
