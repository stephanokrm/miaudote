import {browserAxios} from '../axios';
import {useRouter} from "next/router";
import {useCallback, useEffect} from "react";
import {useQuery} from "react-query";
import {useCookies} from "react-cookie";

export type User = {
    id: string,
    name: string,
    born_at: string,
    email: string,
    email_verified_at: string | null,
    phone: string,
    ibge_city_id: number,
    created_at: string,
    updated_at: string,
    deleted_at: string | null,
};

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
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

    const {data: user, error, refetch} = useQuery<User | null>(['user'], async ({signal}) => {
        try {
            const {data} = await browserAxios.get<User>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user`, {signal});

            return data;
        } catch (error) {
            return null;
        }
    });

    const logout = useCallback(async () => {
        removeCookie('access_token');

        await router.push('/login');
        await refetch();
    }, [removeCookie, router]);

    const login = async (data: { username: string, password: string }) => {
        const {data: token} = await browserAxios.post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/oauth/token`, {
            grant_type: 'password',
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            username: data.username,
            password: data.password,
        });

        setCookie('access_token', token.access_token);

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
        user, error, refetch, logout, login,
    }
}

export default useUser;
