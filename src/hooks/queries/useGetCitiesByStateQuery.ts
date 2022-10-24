import {useQuery} from "@tanstack/react-query";
import {State} from "../../types";
import getCitiesByState from "../../services/getCitiesByState";

type UseGetCitiesByStateQuery = {
    state: State,
}

export const useGetCitiesByStateQuery = ({state}: UseGetCitiesByStateQuery) => {
    return useQuery(['getCitiesByState'], async ({signal}) => {
        return getCitiesByState({state, signal});
    }, {
        staleTime: Infinity,
        enabled: !!state,
    });
}
