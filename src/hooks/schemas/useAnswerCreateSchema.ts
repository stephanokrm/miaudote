import {useMemo} from 'react';
import {
  object as yupObject,
  string as yupString,
} from 'yup';
import {Question} from '../../types';
import {RequiredStringSchema} from 'yup/lib/string';

export const useAnswerCreateSchema = (questions: Question[]) => {
  return useMemo(() => yupObject().shape(
      questions.reduce<{ [key: string]: RequiredStringSchema<string | undefined> }>(
          (rules, question) => ({
            ...rules,
            [question.id]: yupString().
                required(`O campo ${question.value} é obrigatório.`),
          }), {}),
  ), [questions]);
};