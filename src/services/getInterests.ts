import {RawAnimal, Resource} from '../types';
import axios from "../axios";
import rawAnimalToAnimal from '../maps/rawAnimalToAnimal';

type Params = {
  authorization?: string,
  signal?: AbortSignal
}

export const getInterests = async ({authorization, signal}: Params = {}) => {
  const {data: {data: rawAnimals}} = await axios(authorization).get<Resource<RawAnimal[]>>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/interest`, {signal});

  return Promise.all(rawAnimals.map(rawAnimalToAnimal));
}
