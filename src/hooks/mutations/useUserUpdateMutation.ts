import {useQueryClient} from '@tanstack/react-query';
import axios from '../../axios';
import {
  User,
  UserUpdateData,
  RawUser,
  Resource,
  UserEditFieldValues,
} from '../../types';
import {AxiosResponse} from 'axios';
import {UseFormSetError} from 'react-hook-form';
import {useFormMutation} from './useFormMutation';
import {userToRawUser} from '../../maps/userToRawUser';

type Response = Resource<RawUser>;
type SuccessResponse = AxiosResponse<Response>;
type UseUserStoreMutation = {
  setError: UseFormSetError<UserEditFieldValues>,
};

export const useUserUpdateMutation = ({setError}: UseUserStoreMutation) => {
  const queryClient = useQueryClient();

  return useFormMutation<SuccessResponse, UserEditFieldValues>(
      async ({file, ...user}) => {
        return axios().
            post<Response, SuccessResponse, UserUpdateData>(
                `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user/${user.id}`, {
                  ...await userToRawUser(user as User),
                  ...file ? {file} : {},
                  _method: 'PUT',
                }, {
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                  },
                });
      }, {
        setError,
        onSuccess: async () => {
          await queryClient.invalidateQueries(['getUserByMe']);
        },
      });
};
