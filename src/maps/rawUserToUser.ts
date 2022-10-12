import {RawUser, User} from "../types";
import {parsePhoneNumber} from "libphonenumber-js";
import getCityById from "../services/getCityById";

const rawUserToUser = async (rawUser: RawUser): Promise<User> => ({
    id: rawUser.id,
    name: rawUser.name,
    bornAt: null,
    bornAtISO: rawUser.born_at,
    email: rawUser.email,
    avatar: rawUser.avatar,
    emailVerifiedAt: null,
    emailVerifiedAtISO: rawUser.email_verified_at,
    phone: parsePhoneNumber(rawUser.phone, 'BR').formatNational(),
    city: await getCityById({id: rawUser.ibge_city_id}),
    password: rawUser.password,
    passwordConfirmation: rawUser.password_confirmation,
    createdAt: null,
    createdAtISO: rawUser.created_at,
    updatedAt: null,
    updatedAtISO: rawUser.updated_at,
    deletedAt: null,
    deletedAtISO: rawUser.deleted_at,
});

export default rawUserToUser;
