import {Animal, RawAnimal} from "../types";
import {getCity} from "../services/getCity";
import rawBreedToBreed from "./rawBreedToBreed";

const rawAnimalToAnimal = async (rawAnimal: RawAnimal): Promise<Animal> => ({
    id: rawAnimal.id,
    name: rawAnimal.name,
    description: rawAnimal.description,
    bornAt: null,
    bornAtISO: rawAnimal.born_at,
    gender: rawAnimal.gender,
    avatar: rawAnimal.avatar,
    playfulness: rawAnimal.playfulness,
    familyFriendly: rawAnimal.family_friendly,
    petFriendly: rawAnimal.pet_friendly,
    childrenFriendly: rawAnimal.children_friendly,
    city: await getCity({id: rawAnimal.ibge_city_id}),
    userId: rawAnimal.user_id,
    breedId: rawAnimal.breed_id,
    breed: await rawBreedToBreed(rawAnimal.breed),
    createdAt: null,
    createdAtISO: rawAnimal.created_at,
    updatedAt: null,
    updatedAtISO: rawAnimal.updated_at,
    deletedAt: null,
    deletedAtISO: rawAnimal.deleted_at,
});

export default rawAnimalToAnimal;
