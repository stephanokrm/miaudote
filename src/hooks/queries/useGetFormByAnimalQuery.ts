import {useQuery} from '@tanstack/react-query';
import {getFormByAnimal} from '../../services/getFormByAnimal';

export const useGetFormByAnimalQuery = (animal?: string) => {
  return useQuery(['getFormByAnimal', animal], async ({signal}) => {
    return getFormByAnimal({animal: animal as string, signal});
  }, {staleTime: 60000, enabled: !!animal});
};
