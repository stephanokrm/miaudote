import {useMemo} from 'react';
import {
  object as yupObject,
  mixed as yupMixed,
} from 'yup';
import Gender from '../../enums/Gender';
import Species from '../../enums/Species';

export const useAnimalFilterSchema = () => {
  return useMemo(() => yupObject().shape({
    gender: yupMixed<Gender>().
        test((gender) =>
            !gender || Object.values(Gender).includes(gender as Gender),
        ),
    species: yupMixed<Species>().
        test((species) =>
            !species || Object.values(Species).includes(species as Species),
        ),
    castrated: yupMixed<'true' | 'false'>().
        test((castrated) =>
            !castrated || ['true', 'false'].includes(castrated),
        ),
  }), []);
};