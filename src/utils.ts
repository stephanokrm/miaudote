import Gender from './enums/Gender';
import {Animal} from './types';
import Species from './enums/Species';

export const getGenderPrefix = (gender?: Gender | null) => (
    gender === Gender.Female ? 'a' : 'o'
);

export const getAnimalMention = (animal: Animal) => {
  return `${getGenderPrefix(animal.gender)} ${animal.name}`;
}

export const getAnimalGenderLabel = (animal: Animal) => {
  return animal.gender === Gender.Male ? 'Macho' : 'Fêmea';
}

export const getSpecies = (species: Species) => {
 switch (species) {
   case Species.Cat: return 'Gato';
   case Species.Dog: return 'Cachorro';
   default: return 'Espécie Desconhecida';
 }
}
