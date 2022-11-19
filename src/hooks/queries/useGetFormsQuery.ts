import {useQuery} from "@tanstack/react-query";
import {getForms} from '../../services/getForms';

export const useGetFormsQuery = () => {
    return useQuery(['getForms'], async ({signal}) => {
        return getForms({signal});
    }, { staleTime: 60000 });
}
