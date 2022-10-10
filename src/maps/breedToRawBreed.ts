import {Breed, RawBreed} from "../types";

const breedToRawBreed = async (breed: Breed): Promise<RawBreed> => ({
    id: breed.id,
    name: breed.name,
    species: breed.species,
    created_at: breed.createdAtISO,
    updated_at: breed.updatedAtISO,
    deleted_at: breed.deletedAtISO,
});

export default breedToRawBreed;
