import {useQuery} from "@tanstack/react-query";
import getAnimalsByMe from "../../services/getAnimalsByMe";

export const useGetAnimalsByMeQuery = () => {
    return useQuery(['getAnimalsByMe'], async ({signal}) => {
        return getAnimalsByMe({signal});
    }, { staleTime: 60000 });
}
