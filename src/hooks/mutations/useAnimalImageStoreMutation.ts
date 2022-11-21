import {useQueryClient} from '@tanstack/react-query';
import axios from '../../axios';
import {
  AnimalImageStoreData,
  AnimalImageStoreFieldValues,
  RawAnimal,
  Resource,
} from '../../types';
import {AxiosResponse} from 'axios';
import {useFormMutation} from './useFormMutation';

type Response = Resource<RawAnimal>;
type SuccessResponse = AxiosResponse<Response>;

export const useAnimalImageStoreMutation = (animal?: string) => {
  const queryClient = useQueryClient();

  return useFormMutation<SuccessResponse, AnimalImageStoreFieldValues>(
      async ({file}) => {
        return axios().
            post<Response, SuccessResponse, AnimalImageStoreData>(
                `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal}/image`,
                {
                  file,
                }, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
      }, {
        onSuccess: async () => {
          await queryClient.invalidateQueries(['getImagesByAnimal', animal]);
        },
      });
};
