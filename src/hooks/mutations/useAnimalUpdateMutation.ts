import {useQueryClient} from "@tanstack/react-query";
import axios from "../../axios";
import {Animal, AnimalUpdateData, AnimalUpdateFieldValues, RawAnimal, Resource} from "../../types";
import {AxiosResponse} from "axios";
import {UseFormSetError} from "react-hook-form";
import {useFormMutation} from "./useFormMutation";
import animalToRawAnimal from "../../maps/animalToRawAnimal";
import {useRouter} from 'next/router';

type Response = Resource<RawAnimal>;
type SuccessResponse = AxiosResponse<Response>;
type UseAnimalStoreMutation = {
    setError: UseFormSetError<AnimalUpdateFieldValues>,
};

export const useAnimalUpdateMutation = ({ setError }: UseAnimalStoreMutation) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useFormMutation<SuccessResponse, AnimalUpdateFieldValues>(async ({file, ...animal}: AnimalUpdateFieldValues) => {
        return axios().post<Response, SuccessResponse, AnimalUpdateData>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal.id}`, {
            ...await animalToRawAnimal(animal as Animal),
            _method: 'PUT',
            file,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }, {
        setError,
        onSuccess: async (response) => {
            await queryClient.invalidateQueries(['getAnimalByMe']);
            await router.push(`/animal/${response.data.data.id}`);
        },
    })
};
