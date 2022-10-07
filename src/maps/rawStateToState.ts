import {RawState, State} from "../types";

const rawStateToState = async (rawState: RawState): Promise<State> => ({
    label: rawState.nome,
    name: rawState.nome,
    initials: rawState.sigla,
});

export default rawStateToState;
