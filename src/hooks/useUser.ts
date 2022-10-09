import axios from '../axios';
import {useRouter} from "next/router";
import {useCallback, useEffect} from "react";
import {useQuery} from "react-query";
import {useCookies} from "react-cookie";
import {User} from "../types";
import getUser from "../services/getUser";

export enum Middleware {
    AUTH = 'auth',
    GUEST = 'guest',
}

type UseUser = {
    middleware?: Middleware,
    redirectIfAuthenticated?: string,
};

const useUser = ({middleware, redirectIfAuthenticated}: UseUser = {}) => {
    const router = useRouter();
    const [, setCookie, removeCookie] = useCookies(['authorization']);

    const {data: user, error, refetch, isLoading} = useQuery<User | null>(['user'], async ({signal}) => {
        try {
            return await getUser({id: 'me', signal});
        } catch (error) {
            return null;
        }
    }, {});

    const logout = useCallback(async () => {
        removeCookie('authorization');

        await router.push('/login');
        await refetch();
    }, [refetch, removeCookie, router]);

    const login = async (data: { username: string, password: string }) => {
        const {data: token} = await axios().post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/oauth/token`, {
            grant_type: 'password',
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            username: data.username,
            password: data.password,
        });

        setCookie('authorization', token.access_token);

        await router.push('/');
        await refetch();
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [
        error,
        logout,
        middleware,
        redirectIfAuthenticated,
        router,
        user,
    ])

    return {
        user, error, refetch, logout, login, loading: isLoading,
    }
}

export default useUser;
