import {useMemo} from 'react';
import {
  object as yupObject,
  string as yupString,
} from 'yup';

export const useUserLoginSchema = () => {
  return useMemo(() => yupObject().shape({
    email: yupString().
        email('O campo e-mail deve ser um endereço de e-mail válido.').
        required('O campo e-mail é obrigatório.'),
    password: yupString().required('O campo senha é obrigatório.'),
  }), []);
};