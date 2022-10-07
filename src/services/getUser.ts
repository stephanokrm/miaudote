import {RawUser, Resource, User} from "../types";
import rawUserToUser from "../maps/rawUserToUser";
import axios from "../axios";

type Params = {
    id: string,
    authorization?: string,
    signal?: AbortSignal
}

const getUser = async ({id, authorization, signal}: Params): Promise<User> => {
    const {data: {data: rawUser}} = await axios(authorization).get<Resource<RawUser>>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user/${id}`, {signal});

    return rawUserToUser(rawUser);
}

export default getUser;
