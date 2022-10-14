import {useQuery} from "react-query";
import {User} from "../../types";
import getUserByMe from "../../services/getUserByMe";

const useGetUserByMeQuery = () => {
    return useQuery<User>('getUserByMe', async ({signal}) => {
        return getUserByMe({signal});
    });
}

export default useGetUserByMeQuery;
