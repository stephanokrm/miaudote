import axios from "../axios";
import {RawState} from "../types";
import rawStateToState from "../maps/rawStateToState";

type Params = {
    signal?: AbortSignal
}

const getStates = async ({signal}: Params = {}) => {
    const {data: rawStates} = await axios().get<RawState[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome', {signal});

    return Promise.all(rawStates.map(rawStateToState));
}

export default getStates;
