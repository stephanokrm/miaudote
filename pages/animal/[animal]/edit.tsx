import {GetServerSideProps, NextPage} from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from '@mui/material/FormHelperText';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import {Controller} from "react-hook-form";
import * as yup from "yup";
import {addDays, format, parseISO, subYears} from "date-fns";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import {Animal, AnimalUpdateFieldValues} from "../../../src/types";
import Autocomplete from "@mui/material/Autocomplete";
import useForm from "../../../src/hooks/useForm";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import {ChangeEvent} from "react";
import getStates from "../../../src/services/getStates";
import PetsIcon from "@mui/icons-material/Pets";
import {getAnimal} from "../../../src/services/getAnimal";
import Species from "../../../src/enums/Species";
import Gender from "../../../src/enums/Gender";
import {getBreeds} from "../../../src/services/getBreeds";
import {AvatarChangeEvent, InteractableAvatar} from "../../../src/components/InteractableAvatar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Fab from "@mui/material/Fab";
import {InteractableImage} from "../../../src/components/InteractableImage";
import CircularProgress from "@mui/material/CircularProgress";
import {useAnimalUpdateMutation} from "../../../src/hooks/mutations/useAnimalUpdateMutation";
import {useAnimalImageStoreMutation} from "../../../src/hooks/mutations/useAnimalImageStoreMutation";
import {useImageDestroyMutation} from "../../../src/hooks/mutations/useImageDestroyMutation";
import {useGetImagesByAnimalQuery} from "../../../src/hooks/queries/useGetImagesByAnimalQuery";
import {useGetCitiesByStateQuery} from "../../../src/hooks/queries/useGetCitiesByStateQuery";
import {dehydrate, QueryClient} from "@tanstack/react-query";
import {useGetBreedsQuery} from "../../../src/hooks/queries/useGetBreedsQuery";
import {useGetStatesQuery} from "../../../src/hooks/queries/useGetStatesQuery";

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
    bornAt: yup.date().required('O campo mês de nascimento é obrigatório.').min(minDate, 'O campo mês de nascimento deve ser maior que ' + format(minDate, 'MM/yyyy') + '.').max(maxDate, 'O campo mês de nascimento deve ser maior que hoje.'),
    gender: yup.string().oneOf(Object.values(Gender)).required('O campo espécie é obrigatório.'),
    playfulness: yup.number().required('O campo playfulness é obrigatório.'),
    familyFriendly: yup.number().required('O campo familyFriendly é obrigatório.'),
    petFriendly: yup.number().required('O campo petFriendly é obrigatório.'),
    childrenFriendly: yup.number().required('O campo childrenFriendly é obrigatório.'),
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

type AnimalEditProps = {
    animal: Animal,
}

export const getServerSideProps: GetServerSideProps<AnimalEditProps, { animal: string }> = async ({
                                                                                                      params,
                                                                                                      req
                                                                                                  }) => {
    if (!params?.animal) {
        return {
            notFound: true,
        }
    }

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery(['getBreeds'], () => getBreeds({authorization: req.cookies.authorization}));
    await queryClient.prefetchQuery(['getStates'], () => getStates());

    return {
        props: {
            animal: await getAnimal({animal: params.animal, authorization: req.cookies.authorization}),
            dehydratedState: dehydrate(queryClient),
        },
    }
}

const AnimalEdit: NextPage<AnimalEditProps> = ({animal}: AnimalEditProps) => {
    const {
        control,
        handleSubmit,
        formState: {errors},
        setError,
        setValue,
        getValues,
        trigger,
        watch,
    } = useForm<AnimalUpdateFieldValues>({
        // @ts-ignore
        schema,
        defaultValues: {
            ...animal,
            bornAt: parseISO(animal.bornAtISO),
        },
    });
    const {data: images} = useGetImagesByAnimalQuery({animal: animal.id});
    const {data: breeds} = useGetBreedsQuery();
    const {data: states} = useGetStatesQuery();
    const {
        data: cities,
        isLoading: isLoadingCities,
        refetch: refetchCities
    } = useGetCitiesByStateQuery({state: getValues('city.state')});
    const {mutate, isLoading, message} = useAnimalUpdateMutation({setError});
    const {
        mutate: destroyImage,
        isLoading: isDestroyingImage,
        message: destroyImageMessage
    } = useImageDestroyMutation();
    const {
        mutate: storeAnimalImage,
        isLoading: isStoringAnimalImage,
        message: storeAnimalImageMessage
    } = useAnimalImageStoreMutation({animal: animal.id});
    const onSubmit = handleSubmit((data: AnimalUpdateFieldValues) => mutate(data));

    const onAvatarChange = async ({file, avatar}: AvatarChangeEvent) => {
        if (!file || !avatar) {
            return setError('avatar', {
                message: 'Invalid upload',
            });
        }

        setValue('avatar', avatar);
        setValue('file', file);

        await trigger('avatar');
    }

    return (
        <>
            <Head>
                <title>MiAudote - {watch('name')}</title>
            </Head>
            <Container maxWidth="sm">
                <Box paddingY={3}>
                    <Grid container justifyContent="center" alignContent="center" spacing={2}>
                        <Grid item>
                            <Card>
                                <CardContent>
                                    <form onSubmit={onSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} textAlign="center">
                                                <PetsIcon fontSize="large" color="primary"/>
                                            </Grid>
                                            <Grid item xs={12} justifyContent="center" display="flex">
                                                <InteractableAvatar onChange={onAvatarChange} alt={watch('name')}
                                                                    src={getValues('avatar')}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="h3">{watch('name')}</Typography>
                                            </Grid>
                                            {message && (
                                                <Grid item xs={12}>
                                                    <Alert severity="error">{message}</Alert>
                                                </Grid>
                                            )}
                                            {storeAnimalImageMessage && (
                                                <Grid item xs={12}>
                                                    <Alert severity="error">{storeAnimalImageMessage}</Alert>
                                                </Grid>
                                            )}
                                            {destroyImageMessage && (
                                                <Grid item xs={12}>
                                                    <Alert severity="error">{destroyImageMessage}</Alert>
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <FormControl>
                                                    <FormLabel id="speciesLabel">Espécie</FormLabel>
                                                    <Controller name="breed.species" control={control}
                                                                render={({field}) => (
                                                                    <RadioGroup
                                                                        {...field}
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
                                                                )}/>
                                                    {!!errors.breed?.species && (
                                                        <FormHelperText
                                                            error>{errors.breed?.species?.message}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl>
                                                    <FormLabel id="genderLabel">Sexo</FormLabel>
                                                    <Controller name="gender" control={control} render={({field}) => (
                                                        <RadioGroup
                                                            {...field}
                                                            aria-labelledby="speciesLabel"
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
                                                        <FormHelperText error>{errors.gender?.message}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Controller
                                                    name="name"
                                                    control={control}
                                                    render={({field}) => <TextField {...field} label="Nome"
                                                                                    variant="filled"
                                                                                    fullWidth error={!!errors.name}
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
                                                                if (bornAt) setValue('bornAt', bornAt)
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
                                                                )
                                                            }}
                                                        />
                                                    }}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    value={getValues('breed')}
                                                    autoComplete
                                                    disableClearable
                                                    getOptionLabel={({name}) => name}
                                                    onChange={async (event, breed) => {
                                                        setValue('breed', breed);

                                                        await trigger('breed');
                                                    }}
                                                    options={breeds ? breeds.filter(({species}) => species === getValues('breed.species')) : []}
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
                                                    value={getValues('city.state')}
                                                    autoComplete
                                                    disableClearable
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
                                                <Stack spacing={2} direction="row" alignItems="center">
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
                                                <Stack spacing={2} direction="row" alignItems="center">
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
                                                    O quão bem se dá com outros animais de estimação da casa
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack spacing={2} direction="row" alignItems="center">
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
                                                <Stack spacing={2} direction="row" alignItems="center">
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
                                                    render={({field}) => <TextField {...field} multiline
                                                                                    label="Descrição"
                                                                                    variant="filled"
                                                                                    rows={3}
                                                                                    fullWidth
                                                                                    error={!!errors.description}
                                                                                    helperText={errors.description?.message}/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <LoadingButton fullWidth variant="contained" size="large" type="submit"
                                                               loading={isLoading}>
                                                    Atualizar
                                                </LoadingButton>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Box height={250} width={250} display="flex" justifyContent="center"
                                                     alignItems="center">
                                                    <Fab
                                                        color="primary"
                                                        aria-label="Upload Picture"
                                                        component="label"
                                                        disabled={isStoringAnimalImage}
                                                    >
                                                        <input
                                                            hidden
                                                            accept="image/*"
                                                            type="file"
                                                            onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                                                                const file = event.currentTarget.files?.[0];

                                                                if (!file) return;

                                                                await storeAnimalImage({file});
                                                            }}
                                                        />
                                                        {isStoringAnimalImage ? (
                                                            <CircularProgress color="secondary"/>
                                                        ) : (
                                                            <PhotoCameraIcon/>
                                                        )}
                                                    </Fab>
                                                </Box>
                                            </Grid>
                                            {images?.map((image) => (
                                                <Grid item xs={12} md={6} key={image.id}>
                                                    <InteractableImage
                                                        alt={watch('name')}
                                                        onDelete={() => destroyImage(image)}
                                                        src={image.path}
                                                        disabled={isDestroyingImage}
                                                        loading={isDestroyingImage}
                                                    />
                                                </Grid>
                                            ))}
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

export default AnimalEdit;
