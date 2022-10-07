import {useQuery} from "react-query";
import {Animal} from "../types";
import getAnimals from "../services/getAnimals";

type UseAnimals = {
    animals: Animal[],
    error: any,
    loading: boolean,
};

const useAnimals = (): UseAnimals => {
    const {data: animals, error, isLoading} = useQuery<Animal[]>(['animals'], async ({signal}) => {
        return getAnimals({signal});
    });

    return {
        animals: animals ?? [],
        loading: isLoading,
        error,
    };
};

export default useAnimals;
