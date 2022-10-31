import {useMemo} from 'react';
import {format} from 'date-fns';
import {
  date as yupDate,
  number as yupNumber,
  object as yupObject,
  boolean as yupBoolean,
  string as yupString,
  mixed as yupMixed,
} from 'yup';
import Gender from '../../enums/Gender';
import Species from '../../enums/Species';

type UseAnimalEditSchema = {
  minDate: Date,
  maxDate: Date,
};

const stateSchema = yupObject().shape({
  name: yupString().required(),
  initials: yupString().required(),
});

export const useAnimalEditSchema = ({
  minDate,
  maxDate,
}: UseAnimalEditSchema) => {
  return useMemo(() => yupObject().shape({
    id: yupString().required(),
    name: yupString().required('O campo nome é obrigatório.'),
    description: yupString().required('O campo descrição é obrigatório.'),
    avatar: yupString().required('O campo avatar é obrigatório.'),
    bornAt: yupDate().
        typeError('O campo data de nascimento não é uma data válida.').
        required('O campo mês de nascimento é obrigatório.').
        min(minDate, 'O campo mês de nascimento deve ser maior que ' +
            format(minDate, 'MM/yyyy') + '.').
        max(maxDate, 'O campo mês de nascimento deve ser maior que hoje.'),
    gender: yupMixed<Gender>().
        required('O campo espécie é obrigatório.').
        test((gender) =>
            Object.values(Gender).includes(gender as Gender),
        ),
    castrated: yupBoolean().required('O campo castrado é obrigatório.'),
    playfulness: yupNumber().required('O campo playfulness é obrigatório.'),
    familyFriendly: yupNumber().
        required('O campo familyFriendly é obrigatório.'),
    petFriendly: yupNumber().required('O campo petFriendly é obrigatório.'),
    childrenFriendly: yupNumber().
        required('O campo childrenFriendly é obrigatório.'),
    city: yupObject({
      id: yupNumber().required(),
      name: yupString().required(),
      state: stateSchema.required('O campo estado é obrigatório.'),
    }).required('O campo cidade é obrigatório.'),
    breed: yupObject().shape({
      id: yupString(),
      name: yupString(),
      species: yupString().oneOf(Object.values(Species)),
    }).required('O campo raça é obrigatório.'),
    file: yupObject().shape({}).nullable(),
  }), [minDate, maxDate]);
};