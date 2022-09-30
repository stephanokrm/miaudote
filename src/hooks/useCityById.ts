import axios from "axios";
import {useQuery} from "react-query";
import {useEffect} from "react";
import {City, RawCity} from "../types";

type UseCityById = {
    city?: City,
    error: any,
    loading: boolean,
};

const useCityById = (id?: number): UseCityById => {
    const {data: city, error, isLoading, refetch} = useQuery<City | undefined>(['cityById', id], async ({signal}) => {
        if (!id) {
            return;
        }

        const {data} = await axios.get<RawCity>(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${id}`, {signal});

        return {
            id: data.id,
            name: data.nome,
            label: data.nome,
            state: {
                label: data.microrregiao.mesorregiao.UF.nome,
                name: data.microrregiao.mesorregiao.UF.nome,
                initials: data.microrregiao.mesorregiao.UF.sigla,
            }
        };
    })

    useEffect(() => {
        refetch();
    }, [refetch, id]);

    return {
        city,
        loading: isLoading,
        error,
    };
};

export default useCityById;
