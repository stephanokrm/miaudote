import {useQuery} from "react-query";
import {useEffect} from "react";
import {City} from "../types";
import getCityById from "../services/getCityById";

type UseCityById = {
    city?: City,
    error: any,
    loading: boolean,
};

const useCityById = (id?: number): UseCityById => {
    const {data: city, error, isLoading, refetch} = useQuery<City | undefined>(['cityById', id], async ({signal}) => {
        if (!id) {
            return;
        }

        return getCityById({id, signal});
    })

    useEffect(() => {
        refetch();
    }, [refetch, id]);

    return {
        city,
        loading: isLoading,
        error,
    };
};

export default useCityById;
