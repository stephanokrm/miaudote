import {useQuery} from "react-query";
import {Animal} from "../types";
import animalIndex from "../services/animalIndex";

type UseAnimals = {
    animals: Animal[],
    error: any,
    loading: boolean,
};

const useAnimals = (): UseAnimals => {
    const {data: animals, error, isLoading} = useQuery<Animal[]>(['animals'], async ({signal}) => {
        return animalIndex({signal});
    });

    return {
        animals: animals ?? [],
        loading: isLoading,
        error,
    };
};

export default useAnimals;
