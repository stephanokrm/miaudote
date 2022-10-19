import {useQuery} from "@tanstack/react-query";
import {User} from "../../types";
import getUserByMe from "../../services/getUserByMe";

export const useGetUserByMeQuery = () => {
    return useQuery<User>(['getUserByMe'], async ({signal}) => {
        return getUserByMe({signal});
    }, {
        staleTime: Infinity,
    });
}

export default useGetUserByMeQuery;
