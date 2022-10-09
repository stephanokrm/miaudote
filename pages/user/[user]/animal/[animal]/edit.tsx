import {GetServerSideProps, NextPage} from "next";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Fab from "@mui/material/Fab";
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
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import {Animal, City, State} from "../../../../../src/types";
import Autocomplete from "@mui/material/Autocomplete";
import useCitiesByState from "../../../../../src/hooks/useCitiesByState";
import useService from "../../../../../src/hooks/useService";
import useForm from "../../../../../src/hooks/useForm";
import axios from "../../../../../src/axios";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import {useRouter} from "next/router";
import {useState} from "react";
import getStates from "../../../../../src/services/getStates";
import PetsIcon from "@mui/icons-material/Pets";
import getAnimalById from "../../../../../src/services/getAnimalById";

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
    bornAt: yup.date().required('O campo mês de nascimento é obrigatório.').min(minDate, 'O campo mês de nascimento deve ser maior que ' + format(minDate, 'MM/yyyy') + '.').max(maxDate, 'O campo mês de nascimento deve ser maior que hoje.'),
    playfulness: yup.number().required('O campo playfulness é obrigatório.'),
    familyFriendly: yup.number().required('O campo family_friendly é obrigatório.'),
    petFriendly: yup.number().required('O campo family_friendly é obrigatório.'),
    childrenFriendly: yup.number().required('O campo family_friendly é obrigatório.'),
    species: yup.string().oneOf(['DOG', 'CAT']).required('O campo espécie é obrigatório.'),
    gender: yup.string().oneOf(['MALE', 'FEMALE']).required('O campo sexo é obrigatório.'),
    state: stateObject.required('O campo estado é obrigatório.'),
    city: yup.object({
        id: yup.number().required(),
        name: yup.string().required(),
        label: yup.string().required(),
        state: stateObject,
    }).nullable().required('O campo cidade é obrigatório.'),
    breed: yup.string().when('breedId', {
        is: (breedId?: string) => !!breedId,
        then: yup.string().notRequired(),
        otherwise: yup.string().required('O campo raça é obrigatório.'),
    }),
    breedId: yup.string(),
    image: yup.mixed().required('O campo imagem é obrigatório.'),
});

type DonateFormValues = {
    name: string,
    description: string,
    bornAt: Date,
    playfulness: number,
    familyFriendly: number,
    petFriendly: number,
    childrenFriendly: number,
    species: string,
    gender: string,
    state: State,
    city?: City,
    breed?: string
    breedId?: string,
    image: Blob,
};

type UserAnimalCreateProps = {
    states: State[],
    animal: Animal,
}

export const getServerSideProps: GetServerSideProps<UserAnimalCreateProps, { animal: string }> = async ({
                                                                                                            params,
                                                                                                            req
                                                                                                        }) => {
    if (!params) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            animal: await getAnimalById({animal: params.animal, authorization: req.cookies.authorization}),
            states: await getStates(),
        }
    }
}

const UserAnimalEdit: NextPage<UserAnimalCreateProps> = ({animal, states}: UserAnimalCreateProps) => {
    const router = useRouter();
    const [image, setImage] = useState<string>(animal.images[0].url);
    const {
        control,
        handleSubmit,
        formState: {errors},
        setError,
        setValue,
        getValues,
        trigger,
        watch,
    } = useForm<DonateFormValues>({
        // @ts-ignore
        schema,
        defaultValues: {
            name: animal.name,
            description: animal.description,
            bornAt: parseISO(animal.bornAtISO),
            gender: animal.gender,
            playfulness: animal.playfulness,
            familyFriendly: animal.familyFriendly,
            petFriendly: animal.petFriendly,
            childrenFriendly: animal.childrenFriendly,
            city: animal.city,
            state: animal.city.state,
            species: animal.breed.species,
        },
    });
    const {cities, loading: loadingCities} = useCitiesByState(getValues('state'));
    const {
        onSubmit,
        message,
        loading
    } = useService<DonateFormValues>({
        setError,
        handler: async (data: DonateFormValues) => {
            await axios().put(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal/${animal.id}`, {
                name: data.name,
                description: data.description,
                born_at: data.bornAt,
                gender: data.gender,
                playfulness: data.playfulness,
                family_friendly: data.familyFriendly,
                pet_friendly: data.petFriendly,
                children_friendly: data.childrenFriendly,
                species: data.species,
                ibge_city_id: data.city?.id,
                breed: data.breed,
                breed_id: data.breedId,
                image: data.image,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            await router.push('/');
        }
    });
    // @ts-ignore
    const onImageChange = async (e) => {
        const file: Blob = e.target.files[0];

        setImage(URL.createObjectURL(file));
        setValue('image', file);

        await trigger(['image']);
    }

    return (
        <>
            <Head>
                <title>MiAudote</title>
            </Head>
            <Container maxWidth="sm">
                <Box paddingY={3}>
                    <Grid container justifyContent="center" alignContent="center" spacing={2}>
                        <Grid item>
                            <Card>
                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Grid container spacing={2} justifyContent="center">
                                            <Grid item xs={12} textAlign="center">
                                                <PetsIcon fontSize="large" color="primary"/>
                                            </Grid>
                                            {image && (
                                                <Grid item xs={12} justifyContent="center" display="flex">
                                                    <Badge
                                                        overlap="circular"
                                                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                                        badgeContent={
                                                            <Fab color="primary" aria-label="upload picture"
                                                                 component="label">
                                                                <input hidden accept="image/*" type="file"
                                                                       onChange={onImageChange}/>
                                                                <PhotoCameraIcon/>
                                                            </Fab>
                                                        }
                                                    >
                                                        <Avatar alt={getValues('name')} src={image}
                                                                sx={{width: 200, height: 200}}/>
                                                    </Badge>
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <Typography variant="h3">{watch('name')}</Typography>
                                            </Grid>
                                            {message && (
                                                <Grid item xs={12}>
                                                    <Alert severity="error">{message}</Alert>
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <FormControl>
                                                    <FormLabel id="speciesLabel">Espécie</FormLabel>
                                                    <Controller name="species" control={control} render={({field}) => (
                                                        <RadioGroup
                                                            {...field}
                                                            aria-labelledby="speciesLabel"
                                                        >
                                                            <FormControlLabel value="CAT" control={<Radio/>}
                                                                              label="Gato"/>
                                                            <FormControlLabel value="DOG" control={<Radio/>}
                                                                              label="Cachorro"/>
                                                        </RadioGroup>
                                                    )}/>
                                                    {!!errors.species && (
                                                        <FormHelperText error>{errors.species?.message}</FormHelperText>
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
                                                            <FormControlLabel value="FEMALE" control={<Radio/>}
                                                                              label="Fêmea"/>
                                                            <FormControlLabel value="MALE" control={<Radio/>}
                                                                              label="Macho"/>
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
                                                    value={getValues('breed') ?? ''}
                                                    autoComplete
                                                    disableClearable
                                                    onChange={async (event, breed) => {
                                                        setValue('breed', breed);

                                                        await trigger('breed');
                                                    }}
                                                    options={['Vira-lata']}
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
                                                    value={getValues('state')}
                                                    autoComplete
                                                    disableClearable
                                                    onChange={async (event, state) => {
                                                        setValue('city', undefined);
                                                        setValue('state', state);

                                                        await trigger('state');
                                                    }}
                                                    options={states}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="filled"
                                                            fullWidth
                                                            label="Estado"
                                                            error={!!errors.state}
                                                            helperText={errors.state?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    // @ts-ignore
                                                    value={getValues('city') ?? ''}
                                                    autoComplete
                                                    disableClearable
                                                    disabled={loadingCities || cities.length === 0}
                                                    onChange={async (event, city) => {
                                                        setValue('city', city);

                                                        await trigger('city');
                                                    }}
                                                    options={cities}
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
                                                               loading={loading}>
                                                    Atualizar
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

export default UserAnimalEdit;
