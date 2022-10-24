import {useQuery} from "@tanstack/react-query";
import {getCitiesByState} from "../../services/getCitiesByState";

export const useGetCitiesByStateQuery = (state: string) => {
    return useQuery(['getCitiesByState', state], async ({signal}) => {
        return getCitiesByState({state, signal});
    }, {
        staleTime: Infinity,
        enabled: !!state,
    });
}
