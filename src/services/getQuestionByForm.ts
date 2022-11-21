import axios from '../axios';
import {Form, RawQuestion, Resource} from '../types';
import {rawQuestionToQuestion} from '../maps/rawQuestionToQuestion';

type Params = {
  form: Form,
  authorization?: string,
  signal?: AbortSignal
}

export const getQuestionByForm = async ({
  form,
  authorization,
  signal,
}: Params) => {
  const {data: {data: rawQuestions}} = await axios(authorization).
      get<Resource<RawQuestion[]>>(
          `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/form/${form.id}/question`,
          {signal});

  return Promise.all(rawQuestions.map(rawQuestionToQuestion));
};
