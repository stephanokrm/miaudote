import {useQuery} from "@tanstack/react-query";
import {getCitiesByState} from "../../services/getCitiesByState";

export const useGetCitiesByStateQuery = (state?: string) => {
    return useQuery(['getCitiesByState', state], async ({signal}) => {
        return getCitiesByState({state: state as string, signal});
    }, {
        staleTime: Infinity,
        enabled: !!state,
    });
}
