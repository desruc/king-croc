import { ButtonInteraction, Guild } from "discord.js";
import { markHasAnswered, resetStreaks, updateWinner } from "./databaseActions";

const triviaRoleName = "Trivia Kingpin";

const getUserId = (interaction: ButtonInteraction) => interaction.user.id;

const grantWinnerRole = async (guild: Guild, interaction: ButtonInteraction) => {
  const allRoles = await guild.roles.fetch();
  let existingRole = allRoles.find((r) => r.name === triviaRoleName);

  if (!existingRole) {
    existingRole = await guild.roles.create({
      name: triviaRoleName,
      mentionable: false,
      hoist: true,
      position: 3,
      color: "RANDOM"
    });
  }

  // Remove role from previous winner
  const guildMembers = await guild.members.fetch();

  guildMembers.forEach((m) => {
    m.roles.remove(existingRole!);
  });

  const winningMember = guildMembers.find(
    (m) => m.user.id === interaction.member?.user.id
  );

  winningMember?.roles.add(existingRole);
};

export const onCorrectAnswer = async (
  guild: Guild,
  interaction: ButtonInteraction
) => {
  const winningUserId = getUserId(interaction);

  // Update current streak and highest streak
  const winner = await updateWinner(winningUserId);
  // Reset everyone else current streak to zero
  await resetStreaks(winningUserId);

  interaction.reply(
    `Nicely done ${interaction.user}! You are the ${triviaRoleName} and have a streak of ${winner.currentStreak}!`
  );

  grantWinnerRole(guild, interaction);
};

export const onWrongAnswer = async (interaction: ButtonInteraction) => {
  await markHasAnswered(getUserId(interaction));
  interaction.reply(`Sorry, ${interaction.user}! That is incorrect.`);
};

export const onAlreadyAnswered = async (interaction: ButtonInteraction) =>
  interaction.reply({
    content: "Come back tomorrow. You get one answer per question.",
    ephemeral: true
  });
