import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {addDays, parseISO, subYears} from 'date-fns';
import {Animal, AnimalEditFieldValues, Breed} from '../types';
import {createFilterOptions} from '@mui/material/Autocomplete';
import useForm from '../hooks/useForm';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import {FC} from 'react';
import Species from '../enums/Species';
import Gender from '../enums/Gender';
import {AvatarChangeEvent, InteractableAvatar} from './InteractableAvatar';
import {
  useAnimalUpdateMutation,
} from '../hooks/mutations/useAnimalUpdateMutation';
import {
  useGetCitiesByStateQuery,
} from '../hooks/queries/useGetCitiesByStateQuery';
import {useGetBreedsQuery} from '../hooks/queries/useGetBreedsQuery';
import {useGetStatesQuery} from '../hooks/queries/useGetStatesQuery';
import {getGenderPrefix} from '../utils';
import {ControlledTextField} from './ControlledTextField';
import {ControlledDatePicker} from './ControlledDatePicker';
import PetsIcon from '@mui/icons-material/Pets';
import {ControlledRadioGroup} from './ControlledRadioGroup';
import {ControlledAutocomplete} from './ControlledAutocomplete';
import {ControlledSlider} from './ControlledSlider';
import {useAnimalEditSchema} from '../hooks/schemas/useAnimalEditSchema';

const minDate = subYears(new Date(), 30);
const maxDate = addDays(new Date(), 1);
const filter = createFilterOptions<Breed>();

type AnimalEditFormProps = {
  animal: Animal,
}

export const AnimalEditForm: FC<AnimalEditFormProps> = ({animal}: AnimalEditFormProps) => {
  const schema = useAnimalEditSchema({minDate, maxDate});
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    trigger,
    watch,
  } = useForm<AnimalEditFieldValues>({
    schema,
    defaultValues: {
      ...animal,
      bornAt: parseISO(animal.bornAtISO),
    },
  });
  const {data: breeds, isLoading: isLoadingBreeds} = useGetBreedsQuery();
  const {data: states, isLoading: isLoadingStates} = useGetStatesQuery();
  const {
    data: cities,
    isLoading: isLoadingCities,
  } = useGetCitiesByStateQuery(watch('city.state')?.initials);
  const {mutate, isLoading, message} = useAnimalUpdateMutation({setError});

  const onSubmit = handleSubmit(
      (data: AnimalEditFieldValues) => mutate(data),
  );

  const onAvatarChange = async ({file, avatar}: AvatarChangeEvent) => {
    if (!file || !avatar) {
      return setError('avatar', {
        message: 'Invalid upload',
      });
    }

    setValue('avatar', avatar);
    setValue('file', file);

    await trigger('avatar');
  };

  return (
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid
              item
              xs={12}
              justifyContent="center"
              display="flex"
          >
            <InteractableAvatar
                onChange={onAvatarChange}
                alt={watch('name')}
                src={watch('avatar')}
            >
              <PetsIcon fontSize="large"/>
            </InteractableAvatar>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3">{watch('name') ??
                'Doar'}</Typography>
          </Grid>
          {message && (
              <Grid item xs={12}>
                <Alert severity="error">{message}</Alert>
              </Grid>
          )}
          <Grid item xs={12}>
            <ControlledRadioGroup
                control={control}
                name="breed.species"
                label="Espécie"
                options={[
                  {label: 'Gato', value: Species.Cat},
                  {label: 'Cachorro', value: Species.Dog},
                ]}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledRadioGroup
                control={control}
                name="gender"
                label="Sexo"
                options={[
                  {label: 'Fêmea', value: Gender.Female},
                  {label: 'Macho', value: Gender.Male},
                ]}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledRadioGroup
                control={control}
                name="castrated"
                label={
                  `Castrad${getGenderPrefix(watch('gender'))}`
                }
                options={[
                  {label: 'Sim', value: true},
                  {label: 'Não', value: false},
                ]}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
                name="name"
                label="Nome"
                control={control}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledDatePicker
                control={control}
                disableFuture
                label="Data de Nascimento"
                maxDate={maxDate}
                minDate={minDate}
                name="bornAt"
                openTo="year"
                views={['year', 'month']}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledAutocomplete
                name="breed"
                label="Raça"
                control={control}
                disabled={
                    !watch('breed.species') || isLoadingBreeds
                }
                options={breeds ?? []}
                getOptionLabel={(breed) => {
                  if (typeof breed === 'string') return breed;

                  return breed.id
                      ? breed.name
                      : breed.name
                          ? `Adicionar Nova Raça: ${breed.name}`
                          : '';
                }}
                onChange={(breed) => {
                  if (!breed) return;

                  setValue('breed', typeof breed === 'string' ? {
                    id: '',
                    name: breed,
                    species: watch('breed.species'),
                    createdAt: null,
                    createdAtISO: '',
                    updatedAt: null,
                    updatedAtISO: '',
                  } : breed);
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  if (params.inputValue !== '') {
                    filtered.push({
                      id: '',
                      name: params.inputValue,
                      species: watch('breed.species'),
                      createdAt: null,
                      createdAtISO: '',
                      updatedAt: null,
                      updatedAtISO: '',
                    });
                  }

                  return filtered.filter(({species}) => (
                      species === watch('breed.species')
                  ));
                }}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledAutocomplete
                name="city.state"
                label="Estado"
                control={control}
                disabled={isLoadingStates || states?.length === 0}
                options={states ?? []}
                getOptionLabel={(state) => state.name}
                onChange={(state) => {
                  setValue('city', {
                    id: 0,
                    name: '',
                    state: state ?? {
                      name: '',
                      initials: '',
                    },
                  });
                }}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledAutocomplete
                name="city"
                label="Cidade"
                control={control}
                loading={isLoadingCities}
                disabled={isLoadingCities || cities?.length === 0}
                options={cities ?? []}
                getOptionLabel={(city) => city.name ?? ''}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledSlider
                control={control}
                helperText="O quão brincalhão é"
                label="Brincadeiras"
                marks
                max={5}
                min={1}
                name="playfulness"
                step={1}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledSlider
                control={control}
                helperText="O quão carinhoso é com a família"
                label="Amigável Com Família"
                marks
                max={5}
                min={1}
                name="familyFriendly"
                step={1}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledSlider
                control={control}
                helperText="O quão bem se dá com outros animais de estimação da casa"
                label="Amigável Com Outros Animais"
                marks
                max={5}
                min={1}
                name="petFriendly"
                step={1}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledSlider
                control={control}
                helperText="O quão bem se dá com crianças"
                label="Amigável Com Crianças"
                marks
                max={5}
                min={1}
                name="childrenFriendly"
                step={1}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
                name="description"
                label="Descrição"
                control={control}
                multiline
                rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
                fullWidth
                loading={isLoading}
                size="large"
                type="submit"
                variant="contained"
            >
              Atualizar
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
  );
};
