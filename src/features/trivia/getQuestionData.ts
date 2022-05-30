import axios from "axios";
import { shuffleArray } from "../../utils/helpers";

interface QuestionData {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface OpenTriviaResponse {
  response_code: number;
  results: QuestionData[];
}

export const getQuestionData = async () => {
  const response = await axios.get<OpenTriviaResponse>(
    "https://opentdb.com/api.php?amount=1&encode=url3986"
  );

  const { data } = response;

  const { question, correct_answer, incorrect_answers } = data.results[0];

  const incorrectAnswers = incorrect_answers.map((i) => decodeURIComponent(i));

  const answer = decodeURIComponent(correct_answer).trim();

  const allAnswers = shuffleArray<string>([...incorrectAnswers, answer]);

  return {
    question,
    answer,
    allAnswers,
    incorrectAnswers
  };
};

export default getQuestionData;
