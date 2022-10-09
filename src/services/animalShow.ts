import {Animal, RawAnimal, Resource} from "../types";
import axios from "../axios";
import rawAnimalToAnimal from "../maps/rawAnimalToAnimal";

type Params = {
    animal: string,
    authorization?: string,
    signal?: AbortSignal
}

const animalShow = async ({animal, authorization, signal}: Params): Promise<Animal> => {
    const {data: {data: rawAnimal}} = await axios(authorization).get<Resource<RawAnimal>>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal}`, {signal});

    return rawAnimalToAnimal(rawAnimal);
}

export default animalShow;
