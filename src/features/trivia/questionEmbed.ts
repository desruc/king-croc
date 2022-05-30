import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export const getInitialComponentRow = (answers: string[]): MessageActionRow => {
  const buttons = answers.map((a) =>
    new MessageButton().setCustomId(a).setLabel(a).setStyle("PRIMARY")
  );

  return new MessageActionRow().addComponents(buttons);
};

export const createTriviaEmbed = (question: string): MessageEmbed => {
  const embed = new MessageEmbed().setColor("RANDOM");

  embed.setTitle(decodeURIComponent(question));

  return embed;
};

export const getCompletedAnswerRow = (answers: string[], correctAnswer: string) => {
  const buttons = answers.map((a) =>
    new MessageButton()
      .setCustomId(a)
      .setLabel(a)
      .setDisabled(true)
      .setStyle(a === correctAnswer ? "SUCCESS" : "DANGER")
  );

  return new MessageActionRow().addComponents(buttons);
};
