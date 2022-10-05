import {NextPage} from "next";
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
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import {addDays, format, subYears} from "date-fns";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import {City, State} from "../src/types";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import useStates from "../src/hooks/useStates";
import useCitiesByState from "../src/hooks/useCitiesByState";
import useService from "../src/hooks/useService";
import {browserAxios} from "../src/axios";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import {useRouter} from "next/router";
import Image from 'next/image'
import {useState} from "react";

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
    bornAt: yup.date().nullable().required('O campo mês de nascimento é obrigatório.').min(minDate, 'O campo mês de nascimento deve ser maior que ' + format(minDate, 'MM/yyyy') + '.').max(maxDate, 'O campo mês de nascimento deve ser maior que hoje.'),
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
    breed: yup.string(),
    breedId: yup.string(),
    image: yup.mixed().required(),
});

type DonateFormValues = {
    name: string,
    description: string,
    bornAt: Date | null
    playfulness: number,
    familyFriendly: number,
    petFriendly: number,
    childrenFriendly: number,
    species: 'DOG' | 'CAT',
    gender: 'MALE' | 'FEMALE',
    state: State,
    city?: City,
    breed?: string
    breedId?: string,
    image: any,
};

const Donate: NextPage = () => {
    const router = useRouter();
    const [image, setImage] = useState<string>();
    const {
        control,
        handleSubmit,
        formState: {errors},
        setError,
        setValue,
        getValues,
        trigger
    } = useForm<DonateFormValues>({
        mode: 'onBlur',
        resolver: yupResolver(schema),
        shouldUseNativeValidation: false,
        defaultValues: {
            bornAt: null,
            playfulness: 3,
            familyFriendly: 3,
            petFriendly: 3,
            childrenFriendly: 3,
        },
    });
    const {states, loading: loadingStates} = useStates();
    const {cities, loading: loadingCities} = useCitiesByState(getValues('state'));
    const {
        onSubmit,
        message,
        loading
    } = useService<DonateFormValues>({
        setError,
        handler: async (data: DonateFormValues) => {
            await browserAxios.post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animals`, {
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
    const onImageChange = (e) => {
        // @ts-ignore
        const file = e.target.files[0];

        setImage(URL.createObjectURL(file));
        setValue('image', file);
    }

    return (
        <>
            <Head>
                <title>MiAudote - Doar</title>
            </Head>
            <Container maxWidth="sm">
                <Box paddingY={3}>
                    <Grid container justifyContent="center" alignContent="center" spacing={2}>
                        <Grid item>
                            <Card>
                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Grid container spacing={2} justifyContent="center">
                                            <Grid item xs={12}>
                                                <Typography variant="h2">Doar</Typography>
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
                                                            value={getValues('bornAt')}
                                                            onChange={(bornAt) => setValue('bornAt', bornAt)}
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
                                                    disabled={loadingStates || states.length === 0}
                                                    onChange={async (event, breed) => {
                                                        setValue('breed', breed);

                                                        await trigger(['breed']);
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
                                                    value={getValues('state') ?? ''}
                                                    autoComplete
                                                    disableClearable
                                                    disabled={loadingStates || states.length === 0}
                                                    onChange={async (event, state) => {
                                                        setValue('city', undefined);
                                                        setValue('state', state);

                                                        await trigger(['state', 'city']);
                                                    }}
                                                    options={states}
                                                    renderInput={(params) => (
                                                        <TextField {...params}
                                                                   variant="filled"
                                                                   fullWidth
                                                                   label="Estado"
                                                                   error={!!errors.state}
                                                                   helperText={errors.state?.message}/>
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
                                                        <TextField {...params}
                                                                   variant="filled"
                                                                   fullWidth
                                                                   label="Cidade"
                                                                   error={!!errors.city}
                                                                   helperText={errors.city?.message}/>
                                                    )}
                                                />
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
                                                <IconButton color="primary" aria-label="upload picture"
                                                            component="label">
                                                    <input hidden accept="image/*" type="file"
                                                           onChange={onImageChange}/>
                                                    <PhotoCameraIcon/>
                                                </IconButton>
                                                <FormHelperText>Use imagens quadradas para melhor
                                                    experiência.</FormHelperText>
                                            </Grid>
                                            {image && (
                                                <Grid item xs={12}>
                                                    <Image
                                                        src={image}
                                                        alt={getValues('name')}
                                                        height="250"
                                                        width="250"
                                                    />
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <LoadingButton fullWidth variant="contained" size="large" type="submit"
                                                               loading={loading}>
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

export default Donate;
