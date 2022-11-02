import {useQuery} from "@tanstack/react-query";
import {getInterests} from '../../services/getInterests';

export const useGetInterestsQuery = () => {
    return useQuery(['getInterests'], async ({signal}) => {
        return getInterests({signal});
    }, { staleTime: 60000 });
}
