import {useQuery} from "react-query";
import {Image} from "../../types";
import getImagesByAnimal from "../../services/getImagesByAnimal";

type UseGetAnimalsQuery = {
    animal: string,
}

export const useGetImagesByAnimalQuery = ({animal}: UseGetAnimalsQuery) => {
    return useQuery<Image[]>('getImagesByAnimal', async ({signal}) => {
        return getImagesByAnimal({animal, signal});
    }, {staleTime: 60000});
}
