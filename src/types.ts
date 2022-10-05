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

export type Image = {
    url: string,
};

export type Resource<T> = {
    data: T,
};

export type RawAnimal = {
    name: string,
    gender: string,
    born_at: string,
    ibge_city_id: number,
    images: Image[],
};

export type Animal = {
    name: string,
    gender: string,
    bornAt: Date,
    city: City,
    images: Image[],
};
