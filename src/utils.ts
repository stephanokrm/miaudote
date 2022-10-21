import Gender from './enums/Gender';

export const getGenderPrefix = (gender: Gender) => (
    gender === Gender.Male ? 'o' : 'a'
);