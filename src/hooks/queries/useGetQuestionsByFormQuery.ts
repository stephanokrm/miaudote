import {useQuery} from '@tanstack/react-query';
import {Form} from '../../types';
import {getQuestionByForm} from '../../services/getQuestionByForm';

export const useGetQuestionsByFormQuery = (form?: Form) => {
  return useQuery(['getQuestionByForm', form?.id], async ({signal}) => {
    return getQuestionByForm({form: form as Form, signal});
  }, {staleTime: Infinity, enabled: !!form});
};
