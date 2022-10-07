import {useEffect} from "react";
import {useQuery} from "react-query";
import {City, State} from "../types";
import getCitiesByState from "../services/getCitiesByState";

type UseCitiesByState = {
    cities: City[],
    error: any,
    loading: boolean,
};

const useCitiesByState = (state?: State): UseCitiesByState => {
    const {data: cities, error, isLoading, refetch} = useQuery<City[]>(['citiesByState', state], async ({signal}) => {
        if (!state?.initials) {
            return [];
        }

        return getCitiesByState({state, signal});
    })

    useEffect(() => {
        refetch();
    }, [refetch, state?.initials]);

    return {
        cities: cities ?? [],
        loading: isLoading,
        error,
    };
};

export default useCitiesByState;
