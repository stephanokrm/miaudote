import {RawUser, User} from "../types";
import {parsePhoneNumber} from "libphonenumber-js";
import {getCity} from "../services/getCity";

const rawUserToUser = async (rawUser: RawUser): Promise<User> => ({
    id: rawUser.id,
    name: rawUser.name,
    bornAt: null,
    bornAtISO: rawUser.born_at ?? null,
    email: rawUser.email ?? null,
    avatar: rawUser.avatar,
    emailVerifiedAt: null,
    emailVerifiedAtISO: rawUser.email_verified_at ?? null,
    phone: parsePhoneNumber(rawUser.phone, 'BR').formatNational(),
    city: await getCity({id: rawUser.ibge_city_id}),
    password: rawUser.password ?? null,
    passwordConfirmation: rawUser.password_confirmation ?? null,
    createdAt: null,
    createdAtISO: rawUser.created_at ?? null,
    updatedAt: null,
    updatedAtISO: rawUser.updated_at ?? null,
    deletedAt: null,
    deletedAtISO: rawUser.deleted_at ?? null,
});

export default rawUserToUser;
