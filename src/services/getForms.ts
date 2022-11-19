import {RawForm, Resource} from '../types';
import axios from '../axios';
import {rawFormToForm} from '../maps/rawFormToForm';

type Params = {
  authorization?: string,
  signal?: AbortSignal
}

export const getForms = async ({authorization, signal}: Params = {}) => {
  const {data: {data: rawForm}} = await axios(authorization).
      get<Resource<RawForm[]>>(
          `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/form`, {signal});

  return Promise.all(rawForm.map(rawFormToForm));
};
