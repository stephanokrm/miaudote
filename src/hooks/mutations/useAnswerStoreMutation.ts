import {useQueryClient} from '@tanstack/react-query';
import axios from '../../axios';
import {
  AnswerStoreData,
  RawQuestion,
  Resource,
  Animal, AnswerCreateFieldValues,
} from '../../types';
import {AxiosResponse} from 'axios';
import {UseFormSetError} from 'react-hook-form';
import {useFormMutation} from './useFormMutation';

type Response = Resource<RawQuestion>;
type SuccessResponse = AxiosResponse<Response>;
type UseAnswerStoreMutation = {
  animal?: Animal,
  setError: UseFormSetError<AnswerCreateFieldValues>,
  onSuccess: () => void | Promise<void>,
};

export const useAnswerStoreMutation = ({
  animal,
  setError,
  onSuccess,
}: UseAnswerStoreMutation) => {
  const queryClient = useQueryClient();

  return useFormMutation<SuccessResponse, AnswerCreateFieldValues>(
      async (answers) => {
        return axios().
            post<Response, SuccessResponse, AnswerStoreData>(
                `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal?.id}/answer`,
                answers);
      }, {
        setError,
        onSuccess: async () => {
          await queryClient.invalidateQueries(
              ['getInterestsByAnimalQuery', animal?.id]);
          await onSuccess();
        },
      });
};
