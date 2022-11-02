import {useQuery} from "@tanstack/react-query";
import getAnimals from "../../services/getAnimals";
import {AnimalQuery} from '../../types';

const useGetAnimalsQuery = (query: AnimalQuery) => {
    return useQuery(['getAnimals', query], async ({signal}) => {
        return getAnimals({query, signal});
    }, { staleTime: 60000 });
}

export default useGetAnimalsQuery;
