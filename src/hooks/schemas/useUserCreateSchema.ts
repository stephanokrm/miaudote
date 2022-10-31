import {useMemo} from 'react';
import {format} from 'date-fns';
import {
  date as yupDate,
  number as yupNumber,
  object as yupObject,
  ref as yupRef,
  string as yupString,
  mixed as yupMixed,
} from 'yup';

type UseUserCreateSchema = {
  minDate: Date,
  maxDate: Date,
};

const stateSchema = yupObject().shape({
  name: yupString().required(),
  initials: yupString().required(),
});

export const useUserCreateSchema = ({
  minDate,
  maxDate,
}: UseUserCreateSchema) => {
  return useMemo(() => yupObject().shape({
    avatar: yupString().required('O campo avatar é obrigatório.'),
    name: yupString().required('O campo nome é obrigatório.'),
    bornAt: yupDate().
        typeError('O campo data de nascimento não é uma data válida.').
        required('O campo data de nascimento é obrigatório.').
        min(minDate,
            `O campo data de nascimento deve ser maior que ${format(minDate,
                'dd/MM/yyyy')}.`).
        max(maxDate, 'A sua idade deve ser maior que 18 anos.'),
    email: yupString().
        email('O campo e-mail deve ser um endereço de e-mail válido.').
        required('O campo e-mail é obrigatório.'),
    phone: yupString().required('O campo celular é obrigatório.'),
    city: yupObject({
      id: yupNumber().required(),
      name: yupString().required(),
      state: stateSchema.required('O campo estado é obrigatório.'),
    }).required('O campo cidade é obrigatório.'),
    password: yupString().required('O campo senha é obrigatório.'),
    passwordConfirmation: yupString().
        required('O campo confirmação de senha é obrigatório.').
        oneOf([yupRef('password'), null],
            'O campo confirmação de senha não confere.'),
    file: yupMixed<File>().defined(),
  }), [minDate, maxDate]);
};