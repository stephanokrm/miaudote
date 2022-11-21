import {useQueryClient} from '@tanstack/react-query';
import axios from '../../axios';
import {
  FormStoreData,
  FormCreateFieldValues,
  RawForm,
  Resource,
} from '../../types';
import {AxiosResponse} from 'axios';
import {useRouter} from 'next/router';
import {UseFormSetError} from 'react-hook-form';
import {useFormMutation} from './useFormMutation';

type Response = Resource<RawForm>;
type SuccessResponse = AxiosResponse<Response>;
type UseFormStoreMutation = {
  setError: UseFormSetError<FormCreateFieldValues>,
};

export const useFormStoreMutation = ({setError}: UseFormStoreMutation) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useFormMutation<SuccessResponse, FormCreateFieldValues>(
      async (form) => {
        return axios().
            post<Response, SuccessResponse, FormStoreData>(
                `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/form`, form);
      }, {
        setError,
        onSuccess: async (response) => {
          await queryClient.invalidateQueries(['getForms']);
          await router.push(`/form/${response.data.data.id}/edit`);
        },
      });
};
