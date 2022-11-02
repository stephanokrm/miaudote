import {AnimalQuery, RawAnimal, Resource} from '../types';
import axios from '../axios';
import rawAnimalToAnimal from '../maps/rawAnimalToAnimal';

type Params = {
  query?: AnimalQuery,
  authorization?: string,
  signal?: AbortSignal
}

const getAnimals = async ({query, authorization, signal}: Params = {}) => {
  const {data: {data: rawAnimals}} = await axios(authorization).
      get<Resource<RawAnimal[]>>(
          `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal`,
          {signal, params: query});

  return Promise.all(rawAnimals.map(rawAnimalToAnimal));
};

export default getAnimals;
