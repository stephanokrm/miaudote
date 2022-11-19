import {useQuery} from '@tanstack/react-query';
import {getForm} from '../../services/getForm';

export const useGetFormQuery = (form: string) => {
  return useQuery(['getForm', form], async ({signal}) => {
    return getForm({form, signal});
  }, {staleTime: 60000, enabled: !!form});
};
