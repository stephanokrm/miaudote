import {useQuery} from "@tanstack/react-query";
import {getUser} from '../../services/getUser';

export const useGetUserQuery = (user: string) => {
    return useQuery(['getUser', user], async ({signal}) => {
        return getUser({user, signal});
    }, { staleTime: 60000, enabled: !!user });
}
