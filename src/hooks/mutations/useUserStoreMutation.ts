import axios from "../../axios";
import {User, UserStoreData, UserStoreFieldValues, RawUser, Resource} from "../../types";
import {AxiosResponse} from "axios";
import {UseFormSetError} from "react-hook-form";
import {useFormMutation} from "./useFormMutation";
import {userToRawUser} from "../../maps/userToRawUser";
import {useLoginMutation} from "./useLoginMutation";

type Response = Resource<RawUser>;
type SuccessResponse = AxiosResponse<Response>;
type UseUserStoreMutation = {
    setError: UseFormSetError<UserStoreFieldValues>,
};

export const useUserStoreMutation = ({ setError }: UseUserStoreMutation) => {
    const {mutate: login} = useLoginMutation();

    return useFormMutation<SuccessResponse, UserStoreFieldValues>(async ({file, ...user}: UserStoreFieldValues) => {
        return axios().post<Response, SuccessResponse, UserStoreData>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal`, {
            ...await userToRawUser(user as User),
            file,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }, {
        setError,
        onSuccess: async (response, {file, ...user}: UserStoreFieldValues) => {
            await login(user);
        },
    })
};
