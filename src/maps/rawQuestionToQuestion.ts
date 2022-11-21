import {Question, RawQuestion} from '../types';

export const rawQuestionToQuestion = async (rawQuestion: RawQuestion): Promise<Question> => ({
    id: rawQuestion.id,
    type: rawQuestion.type,
    value: rawQuestion.value,
});
