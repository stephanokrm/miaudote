import axios from '../axios';

type Params = {
  animal: string,
  authorization?: string,
  signal?: AbortSignal
}

export const getInterestsByAnimalQuery = async ({
  animal,
  authorization,
  signal,
}: Params) => {
  const {data: exists} = await axios(authorization).
      get<boolean>(
          `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal}/interest`,
          {signal});

  return exists;
};
