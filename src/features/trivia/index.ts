import { Guild } from "discord.js";
import { Job as ScheduledJob } from "node-schedule";
import logger from "../../core/logger";
import { randomNumber, getTextChannel } from "../../utils/helpers";
import { hasUserAnswered } from "./databaseActions";
import { getQuestionData } from "./getQuestionData";
import { onAlreadyAnswered, onCorrectAnswer, onWrongAnswer } from "./handleAnswer";
import {
  createTriviaEmbed,
  getCompletedAnswerRow,
  getInitialComponentRow
} from "./questionEmbed";

const triviaTimes = [
  "1 17 * * *", // 5:00pm AEST
  "30 17 * * *", // 5:30pm AEST
  "1 18 * * *", // 6:00pm AEST
  "30 18 * * *", // 6:30pm AEST
  "1 19 * * *", // 7:00pm AEST
  "30 19 * * *", // 7:30pm AEST
  "1 20 * * *", // 8:00pm AEST
  "30 20 * * *", // 8:30pm AEST
  "1 21 * * *", // 9:00pm AEST
  "30 21 * * *" // 9:30pm AEST
];

const getTriviaTime = () => {
  const rand = randomNumber(0, triviaTimes.length - 1);
  return triviaTimes[rand];
};

export const rescheduleTrivia = (job: ScheduledJob) => {
  const nextTime = getTriviaTime();
  job.reschedule(nextTime);
  logger.info(`The next trivia question will be sent on ${job.nextInvocation()}`);
};

export async function sendTriviaQuestion(guild: Guild) {
  const channel = await getTextChannel(guild);

  const { question, answer, allAnswers } = await getQuestionData();

  const message = await channel.send({
    embeds: [createTriviaEmbed(question)],
    components: [getInitialComponentRow(allAnswers)]
  });

  const collector = message.createMessageComponentCollector({
    componentType: "BUTTON",
    time: 1800000
  });

  const winnerStopReason = "winner";

  // eslint-disable-next-line
  collector.on("collect", async (interaction) => {
    const hasAnswered = await hasUserAnswered(interaction.user.id);

    if (hasAnswered) return onAlreadyAnswered(interaction);

    if (interaction.customId === answer) {
      collector.stop(winnerStopReason);
      message.edit({ components: [getCompletedAnswerRow(allAnswers, answer)] });
      await onCorrectAnswer(guild, interaction);
    } else {
      await onWrongAnswer(interaction);
    }
  });

  collector.on("end", (_, reason) => {
    if (reason !== winnerStopReason) {
      message.edit({
        content: "**Times up!** It seems no one knew the answer.",
        components: [getCompletedAnswerRow(allAnswers, answer)]
      });
    }
  });
}
