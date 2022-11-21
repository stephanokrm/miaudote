import {Answer, RawAnswer} from '../types';
import {rawQuestionToQuestion} from './rawQuestionToQuestion';

export const rawAnswerToAnswer = async (rawAnswer: RawAnswer): Promise<Answer> => ({
  id: rawAnswer.id,
  value: rawAnswer.value,
  question: rawAnswer.question
      ? await rawQuestionToQuestion(rawAnswer.question)
      : undefined,
});