import {useQuery} from "@tanstack/react-query";
import {getAnimal} from '../../services/getAnimal';

export const useGetAnimalQuery = (animal: string) => {
    return useQuery(['getAnimal', animal], async ({signal}) => {
        return getAnimal({animal, signal});
    }, { staleTime: 60000, enabled: !!animal });
}
