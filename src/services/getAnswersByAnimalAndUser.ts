import axios from '../axios';
import {rawAnswerToAnswer} from '../maps/rawAnswerToAnswer';
import {Animal, Answer, Resource, User} from '../types';

type Params = {
  animal: Animal,
  user: User,
  authorization?: string,
  signal?: AbortSignal
}

export const getAnswersByAnimalAndUser = async ({
  animal,
  user,
  authorization,
  signal,
}: Params) => {
  const {data: {data: rawAnswers}} = await axios(authorization).
      get<Resource<Answer[]>>(
          `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal.id}/user/${user.id}/answer`,
          {signal});

  return Promise.all(rawAnswers.map(rawAnswerToAnswer));
};
