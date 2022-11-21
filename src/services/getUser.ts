import {RawUser, Resource} from '../types';
import axios from '../axios';
import rawUserToUser from '../maps/rawUserToUser';

type Params = {
  user: string,
  authorization?: string,
  signal?: AbortSignal
}

export const getUser = async ({user, authorization, signal}: Params) => {
  const {data: {data: rawUser}} = await axios(authorization).
      get<Resource<RawUser>>(
          `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user/${user}`, {signal});

  return rawUserToUser(rawUser);
};
