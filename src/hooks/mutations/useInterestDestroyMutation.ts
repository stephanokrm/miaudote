import {useQueryClient} from '@tanstack/react-query';
import {Animal} from '../../types';
import {useFormMutation} from './useFormMutation';
import {deleteInterest} from '../../services/deleteInterest';

export const useInterestDestroyMutation = () => {
  const queryClient = useQueryClient();

  return useFormMutation(async (animal: Animal) => {
    return deleteInterest({animal});
  }, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['getInterestsByMe']);
    },
  });
};
