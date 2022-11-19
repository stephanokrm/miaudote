import {useMemo} from 'react';
import {
  mixed as yupMixed,
  object as yupObject,
  string as yupString,
} from 'yup';
import Species from '../../enums/Species';
import Gender from '../../enums/Gender';

export const useFormCreateSchema = () => {
  return useMemo(() => yupObject().shape({
    species: yupMixed<Species>().
        required('O campo espécie é obrigatório.').
        test((specie) =>
            Object.values(Species).includes(specie as Species),
        ),
  }), []);
};