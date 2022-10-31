import {NextPage} from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import {Controller} from 'react-hook-form';
import {addDays, subYears} from 'date-fns';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import {AnimalCreateFieldValues, Breed} from '../../src/types';
import {createFilterOptions} from '@mui/material/Autocomplete';
import useForm from '../../src/hooks/useForm';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import PetsIcon from '@mui/icons-material/Pets';
import {
  AvatarChangeEvent,
  InteractableAvatar,
} from '../../src/components/InteractableAvatar';
import Species from '../../src/enums/Species';
import Gender from '../../src/enums/Gender';
import {
  useAnimalStoreMutation,
} from '../../src/hooks/mutations/useAnimalStoreMutation';
import {
  useGetCitiesByStateQuery,
} from '../../src/hooks/queries/useGetCitiesByStateQuery';
import {useGetBreedsQuery} from '../../src/hooks/queries/useGetBreedsQuery';
import {useGetStatesQuery} from '../../src/hooks/queries/useGetStatesQuery';
import {getGenderPrefix} from '../../src/utils';
import {ControlledTextField} from '../../src/components/ControlledTextField';
import {ControlledDatePicker} from '../../src/components/ControlledDatePicker';
import {
  ControlledAutocomplete,
} from '../../src/components/ControlledAutocomplete';
import {
  useAnimalCreateSchema,
} from '../../src/hooks/schemas/useAnimalCreateSchema';
import {ControlledRadioGroup} from '../../src/components/ControlledRadioGroup';

const minDate = subYears(new Date(), 30);
const maxDate = addDays(new Date(), 1);
const filter = createFilterOptions<Breed>();

const AnimalCreate: NextPage = () => {
  const schema = useAnimalCreateSchema({minDate, maxDate});
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    trigger,
    watch,
  } = useForm<AnimalCreateFieldValues>({
    schema,
    defaultValues: {
      playfulness: 3,
      familyFriendly: 3,
      petFriendly: 3,
      childrenFriendly: 3,
      bornAt: null,
    },
  });
  const {
    data: cities,
    isLoading: isLoadingCities,
  } = useGetCitiesByStateQuery(watch('city.state')?.initials);
  const {data: breeds, isLoading: isLoadingBreeds} = useGetBreedsQuery();
  const {data: states, isLoading: isLoadingStates} = useGetStatesQuery();
  const {mutate, isLoading, message} = useAnimalStoreMutation({setError});
  const onSubmit = handleSubmit(
      (data: AnimalCreateFieldValues) => mutate(data));

  const onAvatarChange = async ({file, avatar}: AvatarChangeEvent) => {
    if (!file || !avatar) {
      return setError('avatar', {
        message: 'Invalid upload',
      });
    }

    setValue('avatar', avatar);
    setValue('file', file);

    await trigger(['avatar', 'file']);
  };

  return (
      <>
        <Head>
          <title>MiAudote - Doar</title>
        </Head>
        <Container maxWidth="sm" disableGutters>
          <Box paddingY={3}>
            <Grid container justifyContent="center" alignContent="center"
                  spacing={2}>
              <Grid item>
                <Card>
                  <CardContent>
                    <form onSubmit={onSubmit}>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} textAlign="center">
                          <PetsIcon fontSize="large" color="primary"/>
                        </Grid>
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
                        <Grid item xs={12} alignContent="center">
                          <FormLabel>Brincadeiras</FormLabel>
                          <FormHelperText sx={{display: 'flex'}}>
                            O quão brincalhão é
                          </FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={2} direction="row"
                                 alignItems="center">
                            <ThumbDownOffAltIcon/>
                            <Controller
                                name="playfulness"
                                control={control}
                                render={({field}) => (
                                    <Slider {...field}
                                            defaultValue={3}
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}/>
                                )}
                            />
                            <ThumbUpOffAltIcon/>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} alignContent="center">
                          <FormLabel>Amigável Com Família</FormLabel>
                          <FormHelperText sx={{display: 'flex'}}>
                            O quão bem é carinhoso com a família
                          </FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={2} direction="row"
                                 alignItems="center">
                            <ThumbDownOffAltIcon/>
                            <Controller
                                name="familyFriendly"
                                control={control}
                                render={({field}) => (
                                    <Slider {...field}
                                            defaultValue={3}
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}/>
                                )}
                            />
                            <ThumbUpOffAltIcon/>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} alignContent="center">
                          <FormLabel>Amigável Com Outros Animais</FormLabel>
                          <FormHelperText sx={{display: 'flex'}}>
                            O quão bem se dá com outros animais de estimação da
                            casa
                          </FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={2} direction="row"
                                 alignItems="center">
                            <ThumbDownOffAltIcon/>
                            <Controller
                                name="petFriendly"
                                control={control}
                                render={({field}) => (
                                    <Slider {...field}
                                            defaultValue={3}
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}/>
                                )}
                            />
                            <ThumbUpOffAltIcon/>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} alignContent="center">
                          <FormLabel>Amigável Com Crianças</FormLabel>
                          <FormHelperText sx={{display: 'flex'}}>
                            O quão bem se dá com crianças
                          </FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={2} direction="row"
                                 alignItems="center">
                            <ThumbDownOffAltIcon/>
                            <Controller
                                name="childrenFriendly"
                                control={control}
                                render={({field}) => (
                                    <Slider {...field}
                                            defaultValue={3}
                                            step={1}
                                            marks
                                            min={1}
                                            max={5}/>
                                )}
                            />
                            <ThumbUpOffAltIcon/>
                          </Stack>
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
                            Cadastrar
                          </LoadingButton>
                        </Grid>
                      </Grid>
                    </form>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </>
  );
};

export default AnimalCreate;
