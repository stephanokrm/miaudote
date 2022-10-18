import {useQuery} from "@tanstack/react-query";
import {Animal} from "../../types";
import getAnimalsByMe from "../../services/getAnimalsByMe";

export const useGetAnimalsByMeQuery = () => {
    return useQuery<Animal[]>(['getAnimalsByMe'], async ({signal}) => {
        return getAnimalsByMe({signal});
    }, { staleTime: 60000 });
}
