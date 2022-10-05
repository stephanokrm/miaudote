import axios from "axios";
import {useQuery} from "react-query";
import {parseISO} from "date-fns";
import {Animal, RawAnimal, RawCity, Resource} from "../types";

type UseAnimals = {
    animals: Animal[],
    error: any,
    loading: boolean,
};

const useAnimals = (): UseAnimals => {
    const {data: animals, error, isLoading} = useQuery<Animal[]>(['animals'], async ({signal}) => {
        const {data: resource} = await axios.get<Resource<RawAnimal[]>>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animals`, {signal});

        return Promise.all(resource.data.map(async (rawAnimal) => {
            const {data} = await axios.get<RawCity>(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${rawAnimal.ibge_city_id}`, {signal});

            return {
                name: rawAnimal.name,
                gender: rawAnimal.gender,
                bornAt: parseISO(rawAnimal.born_at),
                images: rawAnimal.images,
                city: {
                    id: data.id,
                    name: data.nome,
                    label: data.nome,
                    state: {
                        label: data.microrregiao.mesorregiao.UF.nome,
                        name: data.microrregiao.mesorregiao.UF.nome,
                        initials: data.microrregiao.mesorregiao.UF.sigla,
                    }
                }
            }
        }));
    });

    return {
        animals: animals ?? [],
        loading: isLoading,
        error,
    };
};

export default useAnimals;
