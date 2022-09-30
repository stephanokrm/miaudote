import axios from "axios";
import {useQuery} from "react-query";
import {useEffect} from "react";
import {City, RawCity, State} from "../types";

type UseCitiesByState = {
    cities: City[],
    error: any,
    loading: boolean,
};

const useCitiesByState = (state?: State): UseCitiesByState => {
    const {data: cities, error, isLoading, refetch} = useQuery<City[]>(['citiesByState', state], async ({signal}) => {
        if (!state?.initials) {
            return [];
        }

        const {data} = await axios.get<RawCity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.initials}/municipios?orderBy=nome`, {signal});

        return data.map((rawCity) => ({
            id: rawCity.id,
            name: rawCity.nome,
            label: rawCity.nome,
            state: {
                label: rawCity.microrregiao.mesorregiao.UF.nome,
                name: rawCity.microrregiao.mesorregiao.UF.nome,
                initials: rawCity.microrregiao.mesorregiao.UF.sigla,
            }
        }));
    })

    useEffect(() => {
        refetch();
    }, [refetch, state?.initials]);

    return {
        cities: cities ?? [],
        loading: isLoading,
        error,
    };
};

export default useCitiesByState;
