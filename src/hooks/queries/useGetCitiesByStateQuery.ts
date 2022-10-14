import {useQuery} from "react-query";
import {City, State} from "../../types";
import getCitiesByState from "../../services/getCitiesByState";

type UseGetCitiesByStateQuery = {
    state: State,
}

export const useGetCitiesByStateQuery = ({state}: UseGetCitiesByStateQuery) => {
    return useQuery<City[]>('getCitiesByState', async ({signal}) => {
        return getCitiesByState({state, signal});
    }, {
        staleTime: Infinity,
        enabled: !!state,
    });
}
