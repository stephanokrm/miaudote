import {RawAnimal, Resource} from '../types';
import axios from "../axios";
import rawAnimalToAnimal from '../maps/rawAnimalToAnimal';

type Params = {
  authorization?: string,
  signal?: AbortSignal
}

export const getInterestsByMe = async ({authorization, signal}: Params = {}) => {
  const {data: {data: rawAnimals}} = await axios(authorization).get<Resource<RawAnimal[]>>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/interest/me`, {signal});

  return Promise.all(rawAnimals.map(rawAnimalToAnimal));
}
