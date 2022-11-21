import axios from '../axios';
import {Question} from '../types';

type Params = {
  question: Question,
  signal?: AbortSignal
}

export const deleteQuestion = async ({question, signal}: Params) => {
  return axios().
      delete(
          `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/question/${question.id}`,
          {signal});
};
