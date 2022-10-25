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
    path: string,
    profile_type: string,
    profile_id: string,
    created_at: string,
    updated_at: string | null,
};

export type Image = {
    id: string,
    path: string,
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
};

export type Breed = {
    id: string,
    name: string,
    species: Species,
    createdAt: Date | null,
    createdAtISO: string,
    updatedAt: Date | null,
    updatedAtISO: string | null,
};

export type RawAnimal = {
    id: string,
    name: string,
    description: string,
    born_at: string,
    gender: Gender,
    avatar: string,
    castrated: boolean,
    playfulness: Playfulness,
    family_friendly: Friendly,
    pet_friendly: Friendly,
    children_friendly: Friendly,
    user?: RawUser,
    images?: RawImage[],
    ibge_city_id: number,
    user_id: string,
    breed_id: string,
    breed: RawBreed,
    created_at: string,
    updated_at: string | null,
    deleted_at: string | null,
};

export type Animal = {
    id: string,
    name: string,
    description: string,
    bornAt: Date | null,
    bornAtISO: string,
    gender: Gender,
    avatar: string,
    castrated: boolean,
    playfulness: Playfulness,
    familyFriendly: Friendly,
    petFriendly: Friendly,
    childrenFriendly: Friendly,
    city: City,
    breed: Breed,
    user: User | null,
    images: Image[] | null,
    userId: string,
    breedId: string,
    createdAt: Date | null,
    createdAtISO: string,
    updatedAt: Date | null,
    updatedAtISO: string | null,
    deletedAt: Date | null,
    deletedAtISO: string | null,
};

export type RawUser = {
    id: string,
    name: string,
    born_at: string,
    email: string,
    avatar: string,
    email_verified_at: string | null,
    phone: string,
    password: string | null,
    password_confirmation: string | null,
    ibge_city_id: number,
    created_at: string,
    updated_at: string | null,
    deleted_at: string | null,
};

export type User = {
    id: string,
    name: string,
    bornAt: Date | null,
    bornAtISO: string,
    email: string,
    avatar: string,
    emailVerifiedAt: Date | null,
    emailVerifiedAtISO: string | null,
    phone: string,
    password: string | null,
    passwordConfirmation: string | null,
    city: City,
    createdAt: Date | null,
    createdAtISO: string,
    updatedAt: Date | null,
    updatedAtISO: string | null,
    deletedAt: Date | null,
    deletedAtISO: string | null,
};

export type UserStoreFieldValues = User & {
    file: File,
};

export type UserStoreData = RawUser & {
    file: File,
};

export type UserUpdateFieldValues = User & {
    file: File,
};

export type UserUpdateData = RawUser & {
    file: File,
    _method: 'PUT',
};

export type AnimalStoreFieldValues = Animal & {
    file: File,
};

export type AnimalStoreData = Omit<RawAnimal, 'castrated'> & {
    castrated: 1 | 0,
    file: File,
};

export type AnimalUpdateFieldValues = Animal & {
    file: File,
};

export type AnimalUpdateData = Omit<RawAnimal, 'castrated'> & {
    file: File,
    castrated: 1 | 0,
    _method: 'PUT',
};

export type AnimalImageStoreFieldValues = {
    file: File,
}

export type AnimalImageStoreData = {
    file: File,
}
