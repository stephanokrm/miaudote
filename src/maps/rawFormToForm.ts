import {Form, RawForm} from '../types';
import {rawQuestionToQuestion} from './rawQuestionToQuestion';

export const rawFormToForm = async (rawForm: RawForm): Promise<Form> => ({
    id: rawForm.id,
    species: rawForm.species,
    questions: rawForm.questions ? await Promise.all(rawForm.questions.map(rawQuestionToQuestion)) : undefined,
});
