import {useQuery} from '@tanstack/react-query';
import {Animal, User} from '../../types';
import {
  getAnswersByAnimalAndUser,
} from '../../services/getAnswersByAnimalAndUser';

export const useGetAnswersByAnimalAndUserQuery = (
    animal?: Animal, user?: User) => {
  return useQuery(['getAnswersByAnimalAndUser', animal?.id, user?.id],
      async ({signal}) => {
        return getAnswersByAnimalAndUser({
          animal: animal as Animal,
          user: user as User,
          signal,
        });
      }, {staleTime: Infinity, enabled: !!animal && !!user});
};
