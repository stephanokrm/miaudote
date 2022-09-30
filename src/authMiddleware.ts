import {GetServerSideProps} from "next";
import axios from "./axios";

const authMiddleware: GetServerSideProps = async (context) => {
    if (!context.req.cookies.access_token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        };
    }

    try {
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user`, {
            headers: {
                Authorization: `Bearer ${context.req.cookies.access_token}`,
            }
        });

        if (!data) {
            return {
                destination: '/login',
                permanent: false,
                props: {},
            };
        }
    } catch (e) {
        return {
            destination: '/login',
            permanent: false,
            props: {},
        };
    }

    return {
        props: {}
    };
}

export const guard = (callback: Function): GetServerSideProps => {
    return async (context) => {
        if (!context.req.cookies.access_token) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                }
            };
        }

        try {
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user`, {
                headers: {
                    Authorization: `Bearer ${context.req.cookies.access_token}`,
                }
            });

            if (!data) {
                return {
                    redirect: {
                        destination: '/login',
                        permanent: false,
                    }
                };
            }
        } catch (e) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                }
            };
        }

        return await callback(context);
    }
}

export default authMiddleware;
