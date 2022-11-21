import axios from "axios";
import {Cookies} from 'react-cookie';

const browserAxios = () => {
    const instance = axios.create({
        headers: {
            Accept: 'application/json',
        }
    });

    instance.interceptors.request.use((config) => {
        const token = new Cookies().get('authorization');

        if (token) {
            return {
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                },
            };
        }

        return config;
    });

    instance.interceptors.response.use((response) => {
        if (response.status === 401 || response.status === 403) {
            new Cookies().remove('authorization');

            location.href = '/login';
        }

        return response;
    });

    return instance;
}

const serverAxios = (authorization?: string) => axios.create({
    headers: {
        Accept: 'application/json',
        Authorization: authorization ? `Bearer ${authorization}` : '',
    }
});

export default typeof window === 'undefined' ? serverAxios : browserAxios;
