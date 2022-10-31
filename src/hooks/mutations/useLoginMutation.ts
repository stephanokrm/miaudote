import {useQueryClient} from '@tanstack/react-query';
import axios from '../../axios';
import {UserLoginFieldValues} from '../../types';
import {AxiosResponse} from 'axios';
import {useRouter} from 'next/router';
import {useCookies} from 'react-cookie';
import {UseFormSetError} from 'react-hook-form';
import {useFormMutation} from './useFormMutation';

type Data = {
  grant_type: 'password',
  client_id: string,
  client_secret: string,
  username: string,
  password: string,
};

type Response = {
  access_token: string,
};

type SuccessResponse = AxiosResponse<Response>

type UseLoginMutation = {
  setError?: UseFormSetError<UserLoginFieldValues>,
};

export const useLoginMutation = ({setError}: UseLoginMutation = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [, setCookie] = useCookies(['authorization']);

  return useFormMutation<SuccessResponse, UserLoginFieldValues>((user) => {
    return axios().
        post<Response, SuccessResponse, Data>(
            `${process.env.NEXT_PUBLIC_SERVICE_URL}/oauth/token`, {
              grant_type: 'password',
              client_id: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
              client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET ?? '',
              username: user.email,
              password: user.password ?? '',
            });
  }, {
    setError,
    onSuccess: async (response) => {
      setCookie('authorization', response.data.access_token);

      await queryClient.invalidateQueries(['getUserByMe']);
      await router.push('/');
    },
  });
};
