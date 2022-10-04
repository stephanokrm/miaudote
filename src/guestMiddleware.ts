import {GetServerSideProps} from "next";
import {serverAxios} from "./axios";

const guestMiddleware: GetServerSideProps = async (context) => {
    if (!context.req.cookies.access_token) {
        return {
            props: {}
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
                props: {}
            };
        }
    } catch (e) {
        return {
            props: {}
        };
    }

    return {
        redirect: {
            destination: '/',
            permanent: false,
        }
    };
}

export default guestMiddleware;
