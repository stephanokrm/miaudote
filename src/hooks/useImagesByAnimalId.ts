import {useQuery} from "react-query";
import {Image} from "../types";
import getImagesByAnimalId from "../services/getImagesByAnimalId";

type UseImagesByAnimalId = {
    images: Image[],
    error: any,
    loading: boolean,
};

const useImagesByAnimalId = (animal: string): UseImagesByAnimalId => {
    const {data: images, error, isLoading} = useQuery<Image[]>('getImagesByAnimalId', async ({signal}) => {
        return getImagesByAnimalId({animal, signal});
    });

    return {
        images: images ?? [],
        loading: isLoading,
        error,
    };
};

export default useImagesByAnimalId;
