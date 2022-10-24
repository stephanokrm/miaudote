import {useQuery} from "@tanstack/react-query";
import getStates from "../../services/getStates";

export const useGetStatesQuery = () => {
    return useQuery(['getStates'], async ({signal}) => {
        return getStates({signal});
    }, {
        staleTime: Infinity,
    });
}
