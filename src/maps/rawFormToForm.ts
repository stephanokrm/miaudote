import {Form, RawForm} from '../types';

export const rawFormToForm = async (rawForm: RawForm): Promise<Form> => ({
    id: rawForm.id,
    species: rawForm.species,
});
