import axios from 'axios'
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

    const {data: user, error, refetch} = useQuery<User>(['user'], async ({signal}) => {
        const {data} = await axios.get<User>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user`, {signal});

        return data;
    });

    const logout = useCallback(async () => {
        removeCookie('access_token');
        localStorage.removeItem('access_token');

        await router.push('/login');
    }, [removeCookie, router]);

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
        user, error, refetch, logout,
    }
}

export default useUser;
