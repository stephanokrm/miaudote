import {Breed, RawBreed, Resource} from "../types";
import axios from "../axios";
import rawBreedToBreed from "../maps/rawBreedToBreed";

type Params = {
    authorization?: string,
    signal?: AbortSignal
}

const breedIndex = async ({authorization, signal}: Params): Promise<Breed[]> => {
    const {data: {data: rawBreeds}} = await axios(authorization).get<Resource<RawBreed[]>>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/breed`, {signal});

    return Promise.all(rawBreeds.map(rawBreedToBreed));
}

export default breedIndex;
