import {useQueryClient} from '@tanstack/react-query';
import {Form, Question} from '../../types';
import {useFormMutation} from './useFormMutation';
import {deleteQuestion} from '../../services/deleteQuestion';

export const useQuestionDestroyMutation = (form?: Form) => {
  const queryClient = useQueryClient();

  return useFormMutation(async (question: Question) => {
    return deleteQuestion({question});
  }, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['getQuestionByForm', form?.id]);
    },
  });
};
