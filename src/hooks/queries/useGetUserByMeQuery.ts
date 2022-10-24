import {useQuery} from "@tanstack/react-query";
import getUserByMe from "../../services/getUserByMe";

export const useGetUserByMeQuery = () => {
    return useQuery(['getUserByMe'], async ({signal}) => {
        return getUserByMe({signal});
    }, {
        staleTime: Infinity,
    });
}
