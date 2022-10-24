import {useQuery} from "@tanstack/react-query";
import getAnimals from "../../services/getAnimals";

const useGetAnimalsQuery = () => {
    return useQuery(['getAnimals'], async ({signal}) => {
        return getAnimals({signal});
    }, { staleTime: 60000 });
}

export default useGetAnimalsQuery;
