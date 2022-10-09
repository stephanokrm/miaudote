import {useQuery} from "react-query";
import {Animal} from "../types";
import animalMe from "../services/animalMe";

type UseAnimals = {
    animals: Animal[],
    error: any,
    loading: boolean,
};

const useUserAnimals = (): UseAnimals => {
    const {data: animals, error, isLoading} = useQuery<Animal[]>(['userAnimals'], async ({signal}) => {
        return animalMe({signal});
    });

    return {
        animals: animals ?? [],
        loading: isLoading,
        error,
    };
};

export default useUserAnimals;
