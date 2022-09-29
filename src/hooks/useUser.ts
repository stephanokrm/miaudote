import useSWR from 'swr'
import axios from 'axios'

export type User = {
    id: string,
    name: string,
    born_at: string,
    email: string,
    email_verified_at: string | null,
    phone: string,
    ibge_city_id: number,
    created_at: string,
    updated_at: string,
    deleted_at: string | null,
};

const useUser = () => {
    const {data: user, error, mutate} = useSWR(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user`, async () => {
        const { data } = await axios.get<User>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user`);

        return data;
    })

    return {
        user, error, mutate
    }
}

export default useUser;
