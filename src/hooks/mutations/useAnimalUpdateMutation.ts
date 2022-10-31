import {useQueryClient} from "@tanstack/react-query";
import axios from "../../axios";
import {Animal, AnimalUpdateData, AnimalEditFieldValues, RawAnimal, Resource} from "../../types";
import {AxiosResponse} from "axios";
import {UseFormSetError} from "react-hook-form";
import {useFormMutation} from "./useFormMutation";
import animalToRawAnimal from "../../maps/animalToRawAnimal";
import {useRouter} from 'next/router';

type Response = Resource<RawAnimal>;
type SuccessResponse = AxiosResponse<Response>;
type UseAnimalStoreMutation = {
    setError: UseFormSetError<AnimalEditFieldValues>,
};

export const useAnimalUpdateMutation = ({ setError }: UseAnimalStoreMutation) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useFormMutation<SuccessResponse, AnimalEditFieldValues>(async ({file, ...animal}) => {
        return axios().post<Response, SuccessResponse, AnimalUpdateData>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal.id}`, {
            ...await animalToRawAnimal(animal as Animal),
            _method: 'PUT',
            castrated: animal.castrated ? 1 : 0,
            file,
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        })
    }, {
        setError,
        onSuccess: async (response) => {
            const animal = response.data.data.id;

            await queryClient.invalidateQueries(['getAnimalByMe']);
            await queryClient.invalidateQueries(['getAnimal', animal]);
            await router.push(`/animal/${animal}`);
        },
    })
};
