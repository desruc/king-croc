import { db } from "../../db";
import { TriviaUser } from "../../db/entities/TriviaUser";

const triviaUserRepository = db.getRepository(TriviaUser);

const getUser = async (userId: string) => {
  const existingUser = await triviaUserRepository.findOneBy({ id: userId });

  if (existingUser) return existingUser;

  const newUser = await triviaUserRepository.save({ id: userId });

  return newUser;
};

export const hasUserAnswered = async (userId: string) => {
  const user = await getUser(userId);
  return user.answered;
};

export const markHasAnswered = async (userId: string) => {
  const user = await getUser(userId);

  user.answered = true;
  user.currentStreak = 0;
  user.totalAnswers += 1;
  await triviaUserRepository.save(user);
};

export const resetStreaks = async (userId: string) => {
  // Reset everyone except the winner
  await triviaUserRepository
    .createQueryBuilder()
    .update()
    .set({ currentStreak: 0 })
    .where("id != :userId", { userId })
    .execute();
};

export const updateWinner = async (userId: string) => {
  const user = await getUser(userId);

  user.currentStreak += 1;
  user.highestStreak += 1;
  user.totalCorrectAnswers += 1;
  user.totalAnswers += 1;
  user.answered = true;
  const updated = await triviaUserRepository.save(user);
  return updated;
};

export default triviaUserRepository;
