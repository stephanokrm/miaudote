import axios from "../axios";
import {Animal} from "../types";

type Params = {
    animal: Animal,
    authorization?: string,
    signal?: AbortSignal
}

export const deleteAnimal = async ({animal, authorization, signal}: Params) => {
    return axios(authorization).delete(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal.id}`, {signal});
}
