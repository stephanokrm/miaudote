import {useQuery} from '@tanstack/react-query';
import {
  getInterestsByAnimalQuery,
} from '../../services/getInterestsByAnimalQuery';

export const useGetInterestsByAnimalQuery = (animal?: string) => {
  return useQuery(['getInterestsByAnimalQuery', animal], async ({signal}) => {
    return getInterestsByAnimalQuery({animal: animal as string, signal});
  }, {staleTime: 60000, enabled: !!animal});
};
