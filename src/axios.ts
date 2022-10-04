import axios from "axios";
import {Cookies} from 'react-cookie';

export const browserAxios = axios.create();
export const serverAxios = axios.create();

browserAxios.interceptors.request.use((config) => {
    const token = new Cookies().get('access_token');

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
