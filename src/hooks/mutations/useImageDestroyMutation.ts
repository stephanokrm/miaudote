import {useQueryClient} from "react-query";
import axios from "../../axios";
import {AnimalImageStoreData, Image, RawAnimal, Resource} from "../../types";
import {AxiosResponse} from "axios";
import {useFormMutation} from "./useFormMutation";

type Response = Resource<RawAnimal>;
type SuccessResponse = AxiosResponse<Response>;

export const useImageDestroyMutation = () => {
    const queryClient = useQueryClient();

    return useFormMutation<SuccessResponse, Image>(async (image: Image) => {
        return axios().delete<Response, SuccessResponse, AnimalImageStoreData>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/image/${image.id}`)
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries('getImagesByAnimal');
        },
    })
};
