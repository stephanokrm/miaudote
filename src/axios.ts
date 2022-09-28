import axios from "axios";

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

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

export default axios;