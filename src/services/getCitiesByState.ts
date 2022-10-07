import axios from "../axios";
import {City, RawCity, State} from "../types";
import rawCityToCity from "../maps/rawCityToCity";

type Params = {
    state: State,
    signal?: AbortSignal
}

const getCitiesByState = async ({state, signal}: Params): Promise<City[]> => {
    const {data: rawCities} = await axios().get<RawCity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.initials}/municipios?orderBy=nome`, {signal});

    return Promise.all(rawCities.map(rawCityToCity));
}

export default getCitiesByState;
