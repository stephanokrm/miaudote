import Gender from './enums/Gender';
import {Animal} from './types';

export const getGenderPrefix = (gender?: Gender | null) => (
    gender === Gender.Female ? 'a' : 'o'
);

export const getAnimalMention = (animal: Animal) => {
  return `${getGenderPrefix(animal.gender)} ${animal.name}`;
}

export const getAnimalGenderLabel = (animal: Animal) => {
  return animal.gender === Gender.Male ? 'Macho' : 'Fêmea';
}