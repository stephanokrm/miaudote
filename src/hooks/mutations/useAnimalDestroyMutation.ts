import {useQueryClient} from "@tanstack/react-query";
import {Animal} from "../../types";
import {useFormMutation} from "./useFormMutation";
import {deleteAnimal} from "../../services/deleteAnimal";

export const useAnimalDestroyMutation = () => {
    const queryClient = useQueryClient();

    return useFormMutation(async (animal: Animal) => {
        return deleteAnimal({animal});
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries(['getAnimalsByMe']);
        },
    })
};
