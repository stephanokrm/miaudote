import {useMemo} from 'react';
import {
  object as yupObject,
  string as yupString,
} from 'yup';

export const useQuestionCreateSchema = () => {
  return useMemo(() => yupObject().shape({
    value: yupString().required('O campo espécie é obrigatório.'),
  }), []);
};