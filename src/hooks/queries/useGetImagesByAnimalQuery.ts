import {useQuery} from "@tanstack/react-query";
import getImagesByAnimal from "../../services/getImagesByAnimal";

type UseGetAnimalsQuery = {
    animal: string,
}

export const useGetImagesByAnimalQuery = ({animal}: UseGetAnimalsQuery) => {
    return useQuery(['getImagesByAnimal'], async ({signal}) => {
        return getImagesByAnimal({animal, signal});
    }, {staleTime: 60000});
}
