import {RawUser, Resource, User} from "../types";
import rawUserToUser from "../maps/rawUserToUser";
import axios from "../axios";

type Params = {
    authorization?: string,
    signal?: AbortSignal
}

const getUserByMe = async ({authorization, signal}: Params): Promise<User> => {
    const {data: {data: rawUser}} = await axios(authorization).get<Resource<RawUser>>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user/me`, {signal});

    return rawUserToUser(rawUser);
}

export default getUserByMe;
