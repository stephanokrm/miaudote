import {Animal, RawAnimal, Resource} from "../types";
import axios from "../axios";
import rawAnimalToAnimal from "../maps/rawAnimalToAnimal";

type Params = {
    user: string,
    authorization?: string,
    signal?: AbortSignal
}

const getUserAnimals = async ({user, authorization, signal}: Params): Promise<Animal[]> => {
    const {data: {data: rawAnimals}} = await axios(authorization).get<Resource<RawAnimal[]>>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user/${user}/animal`, {signal});

    return Promise.all(rawAnimals.map(rawAnimalToAnimal));
}

export default getUserAnimals;
