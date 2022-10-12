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
import {addDays, format, subYears} from "date-fns";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import {Animal, Breed, State} from "../../src/types";
import Autocomplete from "@mui/material/Autocomplete";
import useCitiesByState from "../../src/hooks/useCitiesByState";
import useService from "../../src/hooks/useService";
import useForm from "../../src/hooks/useForm";
import axios from "../../src/axios";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import {useRouter} from "next/router";
import {useState} from "react";
import getStates from "../../src/services/getStates";
import PetsIcon from "@mui/icons-material/Pets";
import {AvatarChangeEvent, InteractableAvatar} from "../../src/components/InteractableAvatar";
import animalToRawAnimal from "../../src/maps/animalToRawAnimal";
import Species from "../../src/enums/Species";
import Gender from "../../src/enums/Gender";
import breedIndex from "../../src/services/breedIndex";

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

type AnimalCreateProps = {
    breeds: Breed[],
    states: State[],
}

export const getServerSideProps: GetServerSideProps<AnimalCreateProps> = async ({req}) => {
    return {
        props: {
            states: await getStates(),
            breeds: await breedIndex({authorization: req.cookies.authorization}),
        }
    }
}

const AnimalCreate: NextPage<AnimalCreateProps> = ({breeds, states}: AnimalCreateProps) => {
    const router = useRouter();
    const [avatar, setAvatar] = useState<File>();
    const {
        control,
        handleSubmit,
        formState: {errors},
        setError,
        setValue,
        getValues,
        trigger,
        watch,
    } = useForm<Animal>({
        // @ts-ignore
        schema,
        defaultValues: {
            playfulness: 3,
            familyFriendly: 3,
            petFriendly: 3,
            childrenFriendly: 3,
        },
    });
    const {cities, loading: loadingCities} = useCitiesByState(getValues('city.state'));
    const {
        onSubmit,
        message,
        loading
    } = useService<Animal>({
        setError,
        handler: async (data: Animal) => {
            await axios().post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/animal`, {
                ...await animalToRawAnimal(data),
                avatar,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            await router.push('/');
        }
    });

    const onAvatarChange = async ({file, avatar}: AvatarChangeEvent) => {
        if (!file || !avatar) {
            return setError('avatar', {
                message: 'Invalid upload',
            });
        }

        setAvatar(file);
        setValue('avatar', avatar);

        await trigger('avatar');
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
                                            <Grid item xs={12} textAlign="center">
                                                <PetsIcon fontSize="large" color="primary"/>
                                            </Grid>
                                            <Grid item xs={12} justifyContent="center" display="flex">
                                                <InteractableAvatar onChange={onAvatarChange} alt={watch('name')}
                                                                    src={getValues('avatar')}>
                                                    <PetsIcon fontSize="large"/>
                                                </InteractableAvatar>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="h3">{watch('name') ?? 'Doar'}</Typography>
                                            </Grid>
                                            {message && (
                                                <Grid item xs={12}>
                                                    <Alert severity="error">{message}</Alert>
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
                                                    value={getValues('breed') ?? ''}
                                                    freeSolo
                                                    disabled={!watch('breed.species')}
                                                    getOptionLabel={(breed) => {
                                                        if (typeof breed === 'string') return breed;

                                                        return breed.name ?? '';
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
                                                    options={breeds.filter(({species}) => species === getValues('breed.species'))}
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
                                                    onChange={async (event, state) => {
                                                        setValue('city', {
                                                            id: 0,
                                                            label: '',
                                                            name: '',
                                                            state,
                                                        });

                                                        await trigger('city');
                                                    }}
                                                    options={states}
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
