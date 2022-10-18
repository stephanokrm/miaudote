import {useQuery} from "@tanstack/react-query";
import {Breed} from "../../types";
import {getBreeds} from "../../services/getBreeds";

export const useGetBreedsQuery = () => {
    return useQuery<Breed[]>(['getBreeds'], async ({signal}) => {
        return getBreeds({signal});
    }, { staleTime: 60000 });
}
