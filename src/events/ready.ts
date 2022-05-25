import Bot, { DiscordEvent } from "../core/bot";

class Ready implements DiscordEvent {
  readonly client;

  readonly name = "ready";

  constructor(private bot: Bot) {
    this.client = bot;
  }

  private async setPresence() {
    this.bot.client.user!.setPresence({
      activities: [{ name: "games with your heart", type: "PLAYING" }]
    });
  }

  public async exec(): Promise<void> {
    setInterval(this.setPresence.bind(this), 30 * 1000);
    this.setPresence();
  }
}

export default Ready;
