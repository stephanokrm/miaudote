import axios from '../../axios';
import {
  User,
  UserStoreData,
  UserCreateFieldValues,
  RawUser,
  Resource,
} from '../../types';
import {AxiosResponse} from 'axios';
import {UseFormSetError} from 'react-hook-form';
import {useFormMutation} from './useFormMutation';
import {userToRawUser} from '../../maps/userToRawUser';
import {useLoginMutation} from './useLoginMutation';

type Response = Resource<RawUser>;
type SuccessResponse = AxiosResponse<Response>;
type UseUserStoreMutation = {
  setError: UseFormSetError<UserCreateFieldValues>,
};

export const useUserStoreMutation = ({setError}: UseUserStoreMutation) => {
  const {mutate: login} = useLoginMutation();

  return useFormMutation<SuccessResponse, UserCreateFieldValues>(
      async ({file, ...user}) => {
        return axios().
            post<Response, SuccessResponse, UserStoreData>(
                `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user`, {
                  ...await userToRawUser(user as User),
                  file,
                }, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
      }, {
        setError,
        onSuccess: async (response, {file, ...user}) => {
          await login(user as User);
        },
      });
};
