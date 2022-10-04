import {GetServerSideProps} from "next";
import {serverAxios} from "./axios";

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
        const {data} = await serverAxios.get(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user`, {
            headers: {
                Authorization: `Bearer ${context.req.cookies.access_token}`,
            }
        });

        if (!data) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }
    } catch (e) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: {}
    };
}

export default authMiddleware;
