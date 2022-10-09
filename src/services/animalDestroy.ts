import axios from "../axios";

type Params = {
    animal: string,
    authorization?: string,
    signal?: AbortSignal
}

const animalDestroy = async ({animal, authorization, signal}: Params) => {
    return axios(authorization).delete(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal}`, {signal});
}

export default animalDestroy;
