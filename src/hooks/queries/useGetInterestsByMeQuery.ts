import {useQuery} from "@tanstack/react-query";
import {getInterestsByMe} from "../../services/getInterestsByMe";

export const useGetInterestsByMeQuery = () => {
    return useQuery(['getInterestsByMe'], async ({signal}) => {
        return getInterestsByMe({signal});
    }, { staleTime: 60000 });
}
