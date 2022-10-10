import Species from "./enums/Species";
import Gender from "./enums/Gender";
import Playfulness from "./enums/Playfulness";
import Friendly from "./enums/Friendly";

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

export type RawImage = {
    id: string,
    url: string,
    avatar: boolean
    profile_type: string,
    profile_id: string,
    created_at: string,
    updated_at: string | null,
};

export type Image = {
    id: string,
    url: string,
    avatar: boolean
    profileType: string,
    profileId: string,
    createdAt: Date | null,
    createdAtISO: string,
    updatedAt: Date | null,
    updatedAtISO: string | null,
};

export type Resource<T> = {
    data: T,
};

export type RawBreed = {
    id: string,
    name: string,
    species: Species,
    created_at: string,
    updated_at: string | null,
    deleted_at: string | null,
};

export type Breed = {
    id: string,
    name: string,
    species: Species,
    createdAt: Date | null,
    createdAtISO: string,
    updatedAt: Date | null,
    updatedAtISO: string | null,
    deletedAt: Date | null,
    deletedAtISO: string | null,
};

export type RawAnimal = {
    id: string,
    name: string,
    description: string,
    born_at: string,
    gender: Gender,
    playfulness: Playfulness,
    family_friendly: Friendly,
    pet_friendly: Friendly,
    children_friendly: Friendly,
    ibge_city_id: number,
    user_id: string,
    breed_id: string,
    breed: RawBreed,
    created_at: string,
    updated_at: string | null,
    deleted_at: string | null,
    images: RawImage[],
};

export type Animal = {
    id: string,
    name: string,
    description: string,
    bornAt: Date | null,
    bornAtISO: string,
    gender: Gender,
    playfulness: Playfulness,
    familyFriendly: Friendly,
    petFriendly: Friendly,
    childrenFriendly: Friendly,
    city: City,
    breed: Breed,
    userId: string,
    breedId: string,
    createdAt: Date | null,
    createdAtISO: string,
    updatedAt: Date | null,
    updatedAtISO: string | null,
    deletedAt: Date | null,
    deletedAtISO: string | null,
    images: Image[],
};

export type RawUser = {
    id: string,
    name: string,
    born_at: string,
    email: string,
    email_verified_at: string | null,
    phone: string,
    ibge_city_id: number,
    created_at: string,
    updated_at: string,
    deleted_at: string | null,
};

export type User = {
    id: string,
    name: string,
    bornAt: Date | null,
    bornAtISO: string,
    email: string,
    emailVerifiedAt: Date | null,
    emailVerifiedAtISO: string | null,
    phone: string,
    city: City,
    createdAt: Date | null,
    createdAtISO: string,
    updatedAt: Date | null,
    updatedAtISO: string | null,
    deletedAt: Date | null,
    deletedAtISO: string | null,
};
