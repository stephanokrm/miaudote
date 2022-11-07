import {useQueryClient} from '@tanstack/react-query';
import axios from '../../axios';
import {useFormMutation} from './useFormMutation';

export const useAnimalInterestStoreMutation = (animal: string) => {
  const queryClient = useQueryClient();

  return useFormMutation(async () => {
    return axios().
        post(
            `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal}/interest`,
        );
  }, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['getInterestsByMe']);
      await queryClient.invalidateQueries(['getInterestsByAnimalQuery', animal]);
    },
  });
};
