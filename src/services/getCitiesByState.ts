import axios from "../axios";
import {RawCity} from "../types";
import rawCityToCity from "../maps/rawCityToCity";

type Params = {
    state: string,
    signal?: AbortSignal
}

export const getCitiesByState = async ({state, signal}: Params) => {
    const {data: rawCities} = await axios().get<RawCity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?orderBy=nome`, {signal});

    return Promise.all(rawCities.map(rawCityToCity));
}
