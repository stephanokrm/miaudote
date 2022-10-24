import Gender from './enums/Gender';
import {Animal} from './types';

const getGenderPrefix = (gender: Gender) => (
    gender === Gender.Male ? 'o' : 'a'
);

export const getAnimalMention = (animal: Animal) => {
  return `${getGenderPrefix(animal.gender)} ${animal.name}`;
}

export const getAnimalGenderLabel = (animal: Animal) => {
  return animal.gender === Gender.Male ? 'Macho' : 'Fêmea';
}