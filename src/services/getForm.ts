import {RawForm, Resource} from '../types';
import axios from '../axios';
import {rawFormToForm} from '../maps/rawFormToForm';

type Params = {
  form: string,
  authorization?: string,
  signal?: AbortSignal
}

export const getForm = async ({form, authorization, signal}: Params) => {
  const {data: {data: rawForm}} = await axios(authorization).
      get<Resource<RawForm>>(
          `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/form/${form}`, {signal});

  return rawFormToForm(rawForm);
};
