import {Image, RawImage, Resource} from "../types";
import axios from "../axios";
import rawImageToImage from "../maps/rawImageToImage";

type Params = {
    animal: string,
    authorization?: string,
    signal?: AbortSignal
}

const getImagesByAnimal = async ({animal, authorization, signal}: Params): Promise<Image[]> => {
    const {data: {data: rawImages}} = await axios(authorization).get<Resource<RawImage[]>>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal}/image`, {signal});

    return Promise.all(rawImages.map(rawImageToImage));
}

export default getImagesByAnimal;
