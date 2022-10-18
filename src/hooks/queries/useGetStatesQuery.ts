import {useQuery} from "@tanstack/react-query";
import {State} from "../../types";
import getStates from "../../services/getStates";

export const useGetStatesQuery = () => {
    return useQuery<State[]>(['getStates'], async ({signal}) => {
        return getStates({signal});
    }, {
        staleTime: Infinity,
    });
}
