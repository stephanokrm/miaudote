import {Animal, RawAnimal, Resource} from "../types";
import axios from "../axios";
import rawAnimalToAnimal from "../maps/rawAnimalToAnimal";

type Params = {
    authorization?: string,
    signal?: AbortSignal
}

const getAnimals = async ({authorization, signal}: Params = {}): Promise<Animal[]> => {
    const {data: {data: rawAnimals}} = await axios(authorization).get<Resource<RawAnimal[]>>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal`, {signal});

    return Promise.all(rawAnimals.map(rawAnimalToAnimal));
}

export default getAnimals;
