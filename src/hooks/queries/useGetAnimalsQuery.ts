import {useQuery} from "@tanstack/react-query";
import {Animal} from "../../types";
import getAnimals from "../../services/getAnimals";

const useGetAnimalsQuery = () => {
    return useQuery<Animal[]>(['getAnimals'], async ({signal}) => {
        return getAnimals({signal});
    }, { staleTime: 60000 });
}

export default useGetAnimalsQuery;
