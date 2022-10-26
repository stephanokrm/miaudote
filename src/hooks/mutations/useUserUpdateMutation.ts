import {useQueryClient} from "@tanstack/react-query";
import axios from "../../axios";
import {User, UserUpdateData, UserUpdateFieldValues, RawUser, Resource} from "../../types";
import {AxiosResponse} from "axios";
import {UseFormSetError} from "react-hook-form";
import {useFormMutation} from "./useFormMutation";
import {userToRawUser} from "../../maps/userToRawUser";

type Response = Resource<RawUser>;
type SuccessResponse = AxiosResponse<Response>;
type UseUserStoreMutation = {
    setError: UseFormSetError<UserUpdateFieldValues>,
};

export const useUserUpdateMutation = ({ setError }: UseUserStoreMutation) => {
    const queryClient = useQueryClient();

    return useFormMutation<SuccessResponse, UserUpdateFieldValues>(async ({file, ...user}) => {
        return axios().post<Response, SuccessResponse, UserUpdateData>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/user/${user.id}`, {
            ...await userToRawUser(user as User),
            _method: 'PUT',
            file,
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        })
    }, {
        setError,
        onSuccess: async () => {
            await queryClient.invalidateQueries(['getUserByMe']);
        },
    })
};
