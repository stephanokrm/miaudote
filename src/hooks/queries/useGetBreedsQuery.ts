import {useQuery} from "@tanstack/react-query";
import {getBreeds} from "../../services/getBreeds";

export const useGetBreedsQuery = () => {
    return useQuery(['getBreeds'], async ({signal}) => {
        return getBreeds({signal});
    }, { staleTime: 60000 });
}
