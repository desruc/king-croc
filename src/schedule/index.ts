import { Client } from "discord.js";
import schedule from "node-schedule";

import { sendTriviaQuestion, rescheduleTrivia } from "../features/trivia";
import { sendWisdom } from "./wisdom";

export default (client: Client) => {
  const triviaJob = schedule.scheduleJob("30 19 * * *", function () {
    client.guilds.cache.forEach((guild) => sendTriviaQuestion(guild));
  });

  schedule.scheduleJob("1 23 * * *", function () {
    rescheduleTrivia(triviaJob);
  });

  schedule.scheduleJob("30 9 * * *", function () {
    client.guilds.cache.forEach((guild) => sendWisdom(guild));
  });
};
