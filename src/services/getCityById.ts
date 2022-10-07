import axios from "../axios";
import {City, RawCity} from "../types";
import rawCityToCity from "../maps/rawCityToCity";

type Params = {
    id: number,
    signal?: AbortSignal
}

const getCityById = async ({id, signal}: Params): Promise<City> => {
    const {data: rawCity} = await axios().get<RawCity>(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${id}`, {signal});

    return rawCityToCity(rawCity);
}

export default getCityById;
