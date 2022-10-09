import {Breed, RawBreed} from "../types";

const rawBreedToBreed = async (rawBreed: RawBreed): Promise<Breed> => ({
    id: rawBreed.id,
    name: rawBreed.id,
    species: rawBreed.species,
    createdAt: null,
    createdAtISO: rawBreed.created_at,
    updatedAt: null,
    updatedAtISO: rawBreed.updated_at,
    deletedAt: null,
    deletedAtISO: rawBreed.deleted_at,
});

export default rawBreedToBreed;
