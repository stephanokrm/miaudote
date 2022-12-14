import {useQuery} from '@tanstack/react-query';
import getImagesByAnimal from '../../services/getImagesByAnimal';

export const useGetImagesByAnimalQuery = (animal?: string) => {
  return useQuery(['getImagesByAnimal', animal], async ({signal}) => {
    return getImagesByAnimal({
      animal: animal as string,
      signal,
    });
  }, {staleTime: 60000, enabled: !!animal});
};
