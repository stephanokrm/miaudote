import {City, RawCity} from "../types";

const rawCityToCity = async (rawCity: RawCity): Promise<City> => ({
    id: rawCity.id,
    name: rawCity.nome,
    label: rawCity.nome,
    state: {
        label: rawCity.microrregiao.mesorregiao.UF.nome,
        name: rawCity.microrregiao.mesorregiao.UF.nome,
        initials: rawCity.microrregiao.mesorregiao.UF.sigla,
    }
});

export default rawCityToCity;
