import useSWR from 'swr'
import axios from 'axios'

const useUser = () => {
    const {data: user, error, mutate} = useSWR(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user`, () =>
        axios
            .get('/api/user')
            .then(res => res.data)
    )

    return {
        user, error, mutate
    }
}

export default useUser;