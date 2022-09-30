export type RawState = {
    sigla: string,
    nome: string,
};

export type RawCity = {
    id: number,
    nome: string,
    microrregiao: {
        mesorregiao: {
            UF: RawState,
        },
    },
};

export type State = {
    name: string,
    initials: string,
    label: string,
};

export type City = {
    id: number,
    name: string,
    label: string,
    state: State,
};
