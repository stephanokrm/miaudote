import {City, RawCity} from "../types";
import rawStateToState from "./rawStateToState";

const rawCityToCity = async (rawCity: RawCity): Promise<City> => ({
    id: rawCity.id,
    name: rawCity.nome,
    state: await rawStateToState(rawCity.microrregiao.mesorregiao.UF),
});

export default rawCityToCity;
