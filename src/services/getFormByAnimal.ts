import axios from '../axios';
import {rawFormToForm} from '../maps/rawFormToForm';
import {RawForm, Resource} from '../types';

type Params = {
  animal: string,
  authorization?: string,
  signal?: AbortSignal
}

export const getFormByAnimal = async ({
  animal,
  authorization,
  signal,
}: Params) => {
  const {data: {data: rawForm}} = await axios(authorization).
      get<Resource<RawForm>>(
          `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal}/form`,
          {signal});

  return rawFormToForm(rawForm);
};
