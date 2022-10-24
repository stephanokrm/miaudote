import {useQueryClient} from "@tanstack/react-query";
import axios from "../../axios";
import {AnimalImageStoreData, AnimalImageStoreFieldValues, RawAnimal, Resource} from "../../types";
import {AxiosResponse} from "axios";
import {useFormMutation} from "./useFormMutation";

type Response = Resource<RawAnimal>;
type SuccessResponse = AxiosResponse<Response>;
type UseAnimalStoreMutation = {
    animal: string,
};

export const useAnimalImageStoreMutation = ({ animal }: UseAnimalStoreMutation) => {
    const queryClient = useQueryClient();

    return useFormMutation<SuccessResponse, AnimalImageStoreFieldValues>(async ({file}) => {
        return axios().post<Response, SuccessResponse, AnimalImageStoreData>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal}/image`, {
            file,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries(['getImagesByAnimal']);
        },
    })
};
