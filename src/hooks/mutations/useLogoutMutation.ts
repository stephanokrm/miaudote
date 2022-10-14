import {useQueryClient} from "react-query";
import axios from "../../axios";
import {useRouter} from "next/router";
import {useCookies} from "react-cookie";
import {useFormMutation} from "./useFormMutation"

export const useLogoutMutation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [,, removeCookie] = useCookies(['authorization']);

    return useFormMutation(() => {
        return axios().post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user/logout`)
    }, {
        onSuccess: async () => {
            removeCookie('authorization');

            await queryClient.invalidateQueries('getUserByMe');
            await router.push('/login');
        },
    })
};
