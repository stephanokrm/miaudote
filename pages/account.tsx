import {GetServerSideProps, NextPage} from "next";
import LoadingButton from '@mui/lab/LoadingButton';
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PetsIcon from '@mui/icons-material/Pets';
import Head from "next/head";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Controller} from "react-hook-form";
import * as yup from "yup";
import {format, parseJSON, subYears} from 'date-fns';
import {browserAxios} from "../src/axios";
import {useEffect} from "react";
import {AsYouType, parsePhoneNumber} from "libphonenumber-js";
import useService from "../src/hooks/useService";
import useForm from "../src/hooks/useForm";
import useUser from "../src/hooks/useUser";
import useCitiesByState from "../src/hooks/useCitiesByState";
import useCityById from "../src/hooks/useCityById";
import useStates from "../src/hooks/useStates";
import {City, State} from "../src/types";
import authMiddleware from "../src/authMiddleware";
import {useRouter} from "next/router";

const minDate = subYears(new Date(), 150);
const maxDate = subYears(new Date(), 18);
const stateObject = yup.object({
    name: yup.string().required(),
    initials: yup.string().required(),
    label: yup.string().required(),
});
const schema = yup.object({
    name: yup.string().required('O campo nome é obrigatório.'),
    bornAt: yup.date().nullable().required('O campo data de nascimento é obrigatório.').min(minDate, 'O campo data de nascimento deve ser maior que ' + format(minDate, 'dd/MM/yyyy') + '.').max(maxDate, 'A sua idade deve ser maior que 18 anos.'),
    email: yup.string().email('O campo e-mail deve ser um endereço de e-mail válido.').required('O campo e-mail é obrigatório.'),
    phone: yup.string().required('O campo celular é obrigatório.'),
    state: stateObject.required('O campo estado é obrigatório.'),
    city: yup.object({
        id: yup.number().required(),
        name: yup.string().required(),
        label: yup.string().required(),
        state: stateObject,
    }).nullable().required('O campo cidade é obrigatório.'),
});

type AccountFormFields = {
    bornAt: Date | null,
    city?: City,
    email: string,
    name: string,
    phone: string,
    state: State,
};

const Account: NextPage = () => {
    const router = useRouter();
    const {user} = useUser();
    const {
        control,
        handleSubmit,
        formState: {errors},
        setValue,
        getValues,
        setError,
        trigger,
    } = useForm<AccountFormFields>({
        // @ts-ignore
        schema,
        defaultValues: {
            name: '',
            email: '',
            bornAt: null,
        },
    });
    const {
        onSubmit,
        message,
        loading
    } = useService<AccountFormFields>({
        setError,
        handler: async (data: AccountFormFields) => {
            await browserAxios.put(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/users/${user?.id}`, {
                name: data.name,
                born_at: data.bornAt,
                email: data.email,
                ibge_city_id: data.city?.id,
                phone: parsePhoneNumber(data.phone, 'BR').number,
            });

            await router.push('/');
        }
    })

    const {states, loading: loadingStates} = useStates();
    const {cities, loading: loadingCities} = useCitiesByState(getValues('state'));
    const {city} = useCityById(user?.ibge_city_id);

    useEffect(() => {
        if (city) {
            setValue('city', city);
            setValue('state', city.state);

            trigger(['state', 'city']);
        }
    }, [setValue, city, trigger]);

    useEffect(() => {
        if (user) {
            setValue('bornAt', parseJSON(user?.born_at ?? ''));
            setValue('phone', user?.phone ? parsePhoneNumber(user.phone, 'BR').formatNational() : '');
            setValue('name', user?.name);
            setValue('email', user?.email);
        }
    }, [setValue, user]);
    return (
        <>
            <Head>
                <title>MiAudote - Conta</title>
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
                                            {message && (
                                                <Grid item xs={12}>
                                                    <Alert severity="error">{message}</Alert>
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <Typography variant="h5">Dados Pessoais</Typography>
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
                                                            label="Data de Nascimento"
                                                            inputFormat="dd/MM/yyyy"
                                                            value={getValues('bornAt')}
                                                            onChange={(bornAt) => {
                                                                if (bornAt) setValue('bornAt', bornAt);
                                                            }}
                                                            disableFuture
                                                            openTo="year"
                                                            views={['year', 'month', 'day']}
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
                                                <Controller
                                                    name="phone"
                                                    control={control}
                                                    render={({field}) => {
                                                        const props = {
                                                            ...field,
                                                            value: field.value ? new AsYouType('BR').input(field.value) : '',
                                                        };

                                                        return <TextField {...props} label="Celular"
                                                                          variant="filled"
                                                                          fullWidth error={!!errors.phone}
                                                                          helperText={errors.phone?.message}/>
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="h5">Endereço</Typography>
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
                                                <Typography variant="h5">Usuário</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Controller
                                                    name="email"
                                                    control={control}
                                                    render={({field}) => <TextField {...field} label="E-mail"
                                                                                    type="email"
                                                                                    variant="filled"
                                                                                    fullWidth error={!!errors.email}
                                                                                    helperText={errors.email?.message}/>}
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

export const getServerSideProps: GetServerSideProps = authMiddleware;

export default Account;
