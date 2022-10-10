import {Animal, RawAnimal, RawBreed, RawImage} from "../types";
import getCityById from "../services/getCityById";
import rawImageToImage from "./rawImageToImage";
import rawBreedToBreed from "./rawBreedToBreed";
import {formatISO} from "date-fns";
import breedToRawBreed from "./breedToRawBreed";
import imageToRawImage from "./imageToRawImage";

const animalToRawAnimal = async (animal: Animal): Promise<RawAnimal> => ({
    id: animal.id,
    name: animal.name,
    description: animal.description,
    born_at: animal.bornAt ? formatISO(animal.bornAt) : '',
    gender: animal.gender,
    playfulness: animal.playfulness,
    family_friendly: animal.familyFriendly,
    pet_friendly: animal.petFriendly,
    children_friendly: animal.childrenFriendly,
    ibge_city_id: animal.city.id,
    user_id: animal.userId,
    breed_id: animal.breedId,
    breed: await breedToRawBreed(animal.breed),
    created_at: animal.createdAtISO,
    updated_at: animal.updatedAtISO,
    deleted_at: animal.deletedAtISO,
    images: await Promise.all(animal.images.map(imageToRawImage)),
});

export default animalToRawAnimal;
