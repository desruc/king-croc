import { Client, ClientOptions, ClientEvents, Collection } from "discord.js";
import { readdirSync } from "fs";
import { resolve } from "path";
import {
  slashCommandCollection,
  prefixedCommandCollection,
  SlashCommand,
  PrefixedCommand
} from "./commandCollection";

import config from "../config";

export interface DiscordEvent {
  name: keyof ClientEvents;
  exec(...args: any): Promise<void>;
}

export default class Bot {
  readonly client: Client;

  public readonly slashCommands: Collection<string, SlashCommand>;

  public readonly prefixedCommands: Collection<string, PrefixedCommand>;

  constructor(opts: ClientOptions) {
    this.client = new Client(opts);
    this.slashCommands = slashCommandCollection;
    this.prefixedCommands = prefixedCommandCollection;
  }

  public async initialize(): Promise<void> {
    this.initializeEvents();

    const { discordToken } = config;
    await this.client.login(discordToken);
  }

  public initializeEvents(): void {
    const eventFiles: string[] = readdirSync(`${__dirname}/../events/`);
    const eventPath = resolve(__dirname, "..", "events");

    eventFiles.forEach((eventFile) => {
      // eslint-disable-next-line
      const event: DiscordEvent = new (require(`${eventPath}/${eventFile}`).default)(
        this
      );

      this.client.on(event.name, async (...args) => {
        await event.exec(...args);
      });
    });
  }
}
