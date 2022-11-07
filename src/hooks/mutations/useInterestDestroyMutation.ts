import {useQueryClient} from '@tanstack/react-query';
import {Animal} from '../../types';
import {useFormMutation} from './useFormMutation';
import {deleteInterest} from '../../services/deleteInterest';

export const useInterestDestroyMutation = (animal: Animal) => {
  const queryClient = useQueryClient();

  return useFormMutation(async () => {
    return deleteInterest({animal});
  }, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['getInterestsByMe']);
      await queryClient.invalidateQueries(['getInterestsByAnimalQuery', animal.id]);
    },
  });
};
