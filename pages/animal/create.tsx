import {NextPage} from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import {Controller} from 'react-hook-form';
import * as yup from 'yup';
import {addDays, format, subYears} from 'date-fns';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import {AnimalStoreFieldValues, Breed} from '../../src/types';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
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

const minDate = subYears(new Date(), 30);
const maxDate = addDays(new Date(), 1);
const stateObject = yup.object({
  name: yup.string().required(),
  initials: yup.string().required(),
  label: yup.string().required(),
});
const schema = yup.object({
  name: yup.string().required('O campo nome é obrigatório.'),
  description: yup.string().required('O campo descrição é obrigatório.'),
  avatar: yup.string().required('O campo avatar é obrigatório.'),
  bornAt: yup.date().
      required('O campo mês de nascimento é obrigatório.').
      min(minDate, 'O campo mês de nascimento deve ser maior que ' +
          format(minDate, 'MM/yyyy') + '.').
      max(maxDate, 'O campo mês de nascimento deve ser maior que hoje.'),
  gender: yup.string().
      oneOf(Object.values(Gender)).
      required('O campo espécie é obrigatório.'),
  castrated: yup.boolean().required('O campo castrado é obrigatório.'),
  playfulness: yup.number().required('O campo playfulness é obrigatório.'),
  familyFriendly: yup.number().
      required('O campo familyFriendly é obrigatório.'),
  petFriendly: yup.number().required('O campo petFriendly é obrigatório.'),
  childrenFriendly: yup.number().
      required('O campo childrenFriendly é obrigatório.'),
  city: yup.object({
    id: yup.number().required(),
    name: yup.string().required(),
    label: yup.string().required(),
    state: stateObject,
  }).required('O campo cidade é obrigatório.'),
  breed: yup.object({
    id: yup.string(),
    name: yup.string(),
    species: yup.string().oneOf(Object.values(Species)),
  }).required('O campo raça é obrigatório.'),
});

const filter = createFilterOptions<Breed>();

const AnimalCreate: NextPage = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
    setValue,
    getValues,
    trigger,
    watch,
  } = useForm<AnimalStoreFieldValues>({
    // @ts-ignore
    schema,
    defaultValues: {
      playfulness: 3,
      familyFriendly: 3,
      petFriendly: 3,
      childrenFriendly: 3,
    },
  });
  const {
    data: cities,
    isLoading: isLoadingCities,
    refetch: refetchCities,
  } = useGetCitiesByStateQuery(getValues('city.state')?.initials);
  const {data: breeds, isLoading: isLoadingBreeds} = useGetBreedsQuery();
  const {data: states, isLoading: isLoadingStates} = useGetStatesQuery();
  const {mutate, isLoading, message} = useAnimalStoreMutation({setError});
  const onSubmit = handleSubmit((data: AnimalStoreFieldValues) => mutate(data));

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
                        <Grid item xs={12} justifyContent="center"
                              display="flex">
                          <InteractableAvatar onChange={onAvatarChange}
                                              alt={watch('name')}
                                              src={getValues('avatar')}>
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
                          <FormControl>
                            <FormLabel id="speciesLabel">Espécie</FormLabel>
                            <Controller
                                name="breed.species"
                                control={control}
                                render={({field}) => (
                                    <RadioGroup
                                        {...field}
                                        onChange={async (...event) => {
                                          field.onChange(...event);

                                          setValue('breed', {
                                            id: '',
                                            name: '',
                                            species: event[0].target.value as Species,
                                            createdAt: null,
                                            createdAtISO: '',
                                            updatedAt: null,
                                            updatedAtISO: '',
                                          });

                                          await trigger('breed');
                                        }}
                                        aria-labelledby="speciesLabel"
                                    >
                                      <FormControlLabel
                                          value={Species.Cat}
                                          control={<Radio/>}
                                          label="Gato"
                                      />
                                      <FormControlLabel
                                          value={Species.Dog}
                                          control={<Radio/>}
                                          label="Cachorro"
                                      />
                                    </RadioGroup>
                                )}
                            />
                            {!!errors.breed?.species && (
                                <FormHelperText
                                    error>{errors.breed?.species?.message}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl>
                            <FormLabel id="genderLabel">Sexo</FormLabel>
                            <Controller name="gender" control={control}
                                        render={({field}) => (
                                            <RadioGroup
                                                {...field}
                                                aria-labelledby="genderLabel"
                                            >
                                              <FormControlLabel
                                                  value={Gender.Female}
                                                  control={<Radio/>}
                                                  label="Fêmea"
                                              />
                                              <FormControlLabel
                                                  value={Gender.Male}
                                                  control={<Radio/>}
                                                  label="Macho"
                                              />
                                            </RadioGroup>
                                        )}/>
                            {!!errors.gender && (
                                <FormHelperText
                                    error>{errors.gender?.message}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl>
                            <FormLabel id="castratedLabel">Castrad{getGenderPrefix(getValues('gender'))}</FormLabel>
                            <Controller name="castrated" control={control}
                                        render={({field}) => (
                                            <RadioGroup
                                                {...field}
                                                aria-labelledby="castratedLabel"
                                            >
                                              <FormControlLabel
                                                  value={true}
                                                  control={<Radio/>}
                                                  label="Sim"
                                              />
                                              <FormControlLabel
                                                  value={false}
                                                  control={<Radio/>}
                                                  label="Não"
                                              />
                                            </RadioGroup>
                                        )}/>
                            {!!errors.castrated && (
                                <FormHelperText error>
                                  {errors.castrated?.message}
                                </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                              name="name"
                              control={control}
                              render={({field}) => <TextField {...field}
                                                              label="Nome"
                                                              variant="filled"
                                                              fullWidth
                                                              error={!!errors.name}
                                                              helperText={errors.name?.message}/>}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                              name="bornAt"
                              control={control}
                              render={({field}) => {
                                return <DatePicker
                                    label="Mês de Nascimento"
                                    inputFormat="MM/yyyy"
                                    value={getValues('bornAt') ?? ''}
                                    onChange={(bornAt) => {
                                      if (bornAt) setValue('bornAt', bornAt);
                                    }}
                                    disableFuture
                                    openTo="year"
                                    views={['year', 'month']}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    renderInput={(params) => {
                                      const inputProps = {
                                        ...field,
                                        ...params.inputProps,
                                      };

                                      return (
                                          <TextField {...params}
                                                     fullWidth
                                                     inputProps={inputProps}
                                                     variant="filled"
                                                     error={!!errors.bornAt}
                                                     helperText={errors.bornAt?.message}/>
                                      );
                                    }}
                                />;
                              }}/>
                        </Grid>
                        <Grid item xs={12}>
                          <Autocomplete
                              value={getValues('breed') ?? ''}
                              selectOnFocus
                              clearOnBlur
                              handleHomeEndKeys
                              freeSolo
                              disabled={!watch('breed.species') ||
                                  isLoadingBreeds}
                              getOptionLabel={(breed) => {
                                if (typeof breed === 'string') return breed;

                                return breed.id ? breed.name : breed.name
                                    ? `Novo: ${breed.name}`
                                    : '';
                              }}
                              onChange={async (event, breed) => {
                                if (!breed) return;

                                setValue('breed', typeof breed === 'string' ? {
                                  id: '',
                                  name: breed,
                                  species: getValues('breed.species'),
                                  createdAt: null,
                                  createdAtISO: '',
                                  updatedAt: null,
                                  updatedAtISO: '',
                                } : breed);

                                await trigger('breed');
                              }}
                              filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                if (params.inputValue !== '') {
                                  filtered.push({
                                    id: '',
                                    name: params.inputValue,
                                    species: getValues('breed.species'),
                                    createdAt: null,
                                    createdAtISO: '',
                                    updatedAt: null,
                                    updatedAtISO: '',
                                  });
                                }

                                return filtered.filter(
                                    ({species}) => species ===
                                        getValues('breed.species'));
                              }}
                              options={breeds ?? []}
                              renderInput={(params) => (
                                  <TextField {...params}
                                             variant="filled"
                                             fullWidth
                                             label="Raça"
                                             error={!!errors.breed}
                                             helperText={errors.breed?.message}/>
                              )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Autocomplete
                              value={getValues('city.state') ?? ''}
                              autoComplete
                              disableClearable
                              disabled={isLoadingStates || states?.length === 0}
                              onChange={async (event, state) => {
                                setValue('city', {
                                  id: 0,
                                  label: '',
                                  name: '',
                                  state,
                                });

                                await trigger('city');
                                await refetchCities();
                              }}
                              options={states ?? []}
                              renderInput={(params) => (
                                  <TextField
                                      {...params}
                                      variant="filled"
                                      fullWidth
                                      label="Estado"
                                      error={!!errors.city?.state}
                                      helperText={errors.city?.state?.message}
                                  />
                              )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Autocomplete
                              value={getValues('city') ?? ''}
                              autoComplete
                              disableClearable
                              disabled={isLoadingCities || cities?.length === 0}
                              onChange={async (event, city) => {
                                setValue('city', city);

                                await trigger('city');
                              }}
                              options={cities ?? []}
                              renderInput={(params) => (
                                  <TextField
                                      {...params}
                                      variant="filled"
                                      fullWidth
                                      label="Cidade"
                                      error={!!errors.city}
                                      helperText={errors.city?.message}
                                  />
                              )}
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
                          <Controller
                              name="description"
                              control={control}
                              render={({field}) => <TextField {...field}
                                                              multiline
                                                              label="Descrição"
                                                              variant="filled"
                                                              rows={3}
                                                              fullWidth
                                                              error={!!errors.description}
                                                              helperText={errors.description?.message}/>}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <LoadingButton fullWidth variant="contained"
                                         size="large" type="submit"
                                         loading={isLoading}>
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
