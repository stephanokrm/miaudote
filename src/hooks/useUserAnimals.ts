import {useQuery} from "react-query";
import {Animal} from "../types";
import getUserAnimals from "../services/getUserAnimals";
import {useRouter} from "next/router";
import {useEffect} from "react";

type UseAnimals = {
    animals: Animal[],
    error: any,
    loading: boolean,
};

const useUserAnimals = (): UseAnimals => {
    const {query} = useRouter();
    const user = query.user as string | undefined;

    const {data: animals, error, isLoading, refetch} = useQuery<Animal[]>(['userAnimals'], async ({signal}) => {
        if (!user) return [];

        return getUserAnimals({user, signal});
    });

    useEffect(() => {
        refetch();
    }, [refetch, user]);

    return {
        animals: animals ?? [],
        loading: isLoading,
        error,
    };
};

export default useUserAnimals;
