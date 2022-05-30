import { Guild, Message } from "discord.js";
import axios from "axios";

import { getTextChannel } from "../utils/helpers";

interface Quote {
  q: string;
  a: string;
  h: string;
}

const dailyWisdomChannelName = "daily-wisdom";

export const sendWisdom = async (
  guild: Guild
): Promise<Message | Array<Message> | void> => {
  const channel = await getTextChannel(guild, dailyWisdomChannelName);

  const response: { data: Quote[] } = await axios.get(
    "https://zenquotes.io/api/today"
  );

  const [quote] = response.data;

  channel.send(`>>> **${quote.q}**\n- ${quote.a}`);
};

export default sendWisdom;
