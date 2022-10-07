import {useQuery} from "react-query";
import {State} from "../types";
import getStates from "../services/getStates";

type UseStates = {
    states: State[],
    error: any,
    loading: boolean,
};

const useStates = (): UseStates => {
    const {data: states, error, isLoading} = useQuery<State[]>(['states'], async ({signal}) => {
        return getStates({signal});
    });

    return {
        states: states ?? [],
        loading: isLoading,
        error,
    };
};

export default useStates;
