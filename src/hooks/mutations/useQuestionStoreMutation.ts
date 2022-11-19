import {useQueryClient} from '@tanstack/react-query';
import axios from '../../axios';
import {
  QuestionStoreData,
  QuestionCreateFieldValues,
  RawQuestion,
  Resource,
  Form,
} from '../../types';
import {AxiosResponse} from 'axios';
import {UseFormSetError} from 'react-hook-form';
import {useFormMutation} from './useFormMutation';

type Response = Resource<RawQuestion>;
type SuccessResponse = AxiosResponse<Response>;
type UseQuestionStoreMutation = {
  form?: Form,
  setError: UseFormSetError<QuestionCreateFieldValues>,
};

export const useQuestionStoreMutation = ({
  form,
  setError,
}: UseQuestionStoreMutation) => {
  const queryClient = useQueryClient();

  return useFormMutation<SuccessResponse, QuestionCreateFieldValues>(
      async (question) => {
        return axios().
            post<Response, SuccessResponse, QuestionStoreData>(
                `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/form/${form?.id}/question`,
                question);
      }, {
        setError,
        onSuccess: async () => {
          await queryClient.invalidateQueries(['getQuestionByForm', form?.id]);
        },
      });
};
