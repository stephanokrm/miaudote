import axios from "axios";
import {useQuery} from "react-query";
import {RawState, State} from "../types";

type UseStates = {
    states: State[],
    error: any,
    loading: boolean,
};

const useStates = (): UseStates => {
    const {data: states, error, isLoading} = useQuery<State[]>(['states'], async ({signal}) => {
        const {data} = await axios.get<RawState[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome', {signal});

        return data.map((rawState) => ({
            label: rawState.nome,
            name: rawState.nome,
            initials: rawState.sigla,
        }));
    });

    return {
        states: states ?? [],
        loading: isLoading,
        error,
    };
};

export default useStates;
