import {useQueryClient} from "@tanstack/react-query";
import axios from "../../axios";
import {Animal, AnimalStoreData, AnimalCreateFieldValues, RawAnimal, Resource} from "../../types";
import {AxiosResponse} from "axios";
import {useRouter} from "next/router";
import {UseFormSetError} from "react-hook-form";
import {useFormMutation} from "./useFormMutation";
import animalToRawAnimal from "../../maps/animalToRawAnimal";

type Response = Resource<RawAnimal>;
type SuccessResponse = AxiosResponse<Response>;
type UseAnimalStoreMutation = {
    setError: UseFormSetError<AnimalCreateFieldValues>,
};

export const useAnimalStoreMutation = ({ setError }: UseAnimalStoreMutation) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useFormMutation<SuccessResponse, AnimalCreateFieldValues>(async ({file, ...animal}) => {
        return axios().post<Response, SuccessResponse, AnimalStoreData>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal`, {
            ...await animalToRawAnimal(animal as Animal),
            castrated: animal.castrated ? 1 : 0,
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
            await router.push(`/animal/${response.data.data.id}/edit`);
        },
    })
};
