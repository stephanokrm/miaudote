import {RawUser, User} from "../types";
import {parsePhoneNumber} from "libphonenumber-js";
import {formatISO} from "date-fns";

export const userToRawUser = async (user: User): Promise<RawUser> => ({
    id: user.id,
    name: user.name,
    born_at: user.bornAt ? formatISO(user.bornAt) : '',
    email: user.email,
    avatar: user.avatar,
    email_verified_at: user.emailVerifiedAt ? formatISO(user.emailVerifiedAt) : '',
    phone: parsePhoneNumber(user.phone, 'BR').number,
    ibge_city_id: user.city.id,
    password: user.password,
    password_confirmation: user.passwordConfirmation,
    created_at: user.createdAtISO,
    updated_at: user.updatedAtISO,
    deleted_at: user.deletedAtISO,
});
