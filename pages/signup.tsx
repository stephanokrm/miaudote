import {NextPage} from "next";
import LoadingButton from '@mui/lab/LoadingButton';
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PetsIcon from '@mui/icons-material/Pets';
import Head from "next/head";
import Link from "next/link";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import {format, subYears} from 'date-fns';
import axios, {AxiosError} from "axios";
import {useEffect, useState} from "react";
import {AsYouType, parsePhoneNumber} from "libphonenumber-js";

const minDate = subYears(new Date(), 150);
const maxDate = subYears(new Date(), 18);
const schema = yup.object({
    name: yup.string().required('O campo nome é obrigatório.'),
    bornAt: yup.date().nullable().required('O campo data de nascimento é obrigatório.').min(minDate, 'O campo data de nascimento deve ser maior que ' + format(minDate, 'dd/MM/yyyy') + '.').max(maxDate, 'A sua idade deve ser maior que 18 anos.'),
    email: yup.string().email('O campo e-mail deve ser um endereço de e-mail válido.').required('O campo e-mail é obrigatório.'),
    phone: yup.string().required('O campo celular é obrigatório.'),
    state: yup.string().nullable().required('O campo estado é obrigatório.'),
    city: yup.number().nullable().required('O campo cidade é obrigatório.'),
    password: yup.string().required('O campo senha é obrigatório.'),
    passwordConfirmation: yup.string().required('O campo confirmação de senha é obrigatório.').oneOf([yup.ref('password'), null], 'O campo confirmação de senha não confere.'),
}).required();

type SignUpFormFields = {
    name: string,
    bornAt: Date | null,
    email: string,
    state: string | null,
    city: number | null,
    phone: string,
    password: string,
    passwordConfirmation: string,
};

type SignUpFormField = keyof SignUpFormFields;

type City = {
    id: number,
    nome: string,
};

type State = {
    nome: string,
    sigla: string,
};

const SignUp: NextPage = () => {
    const [loadingStates, setLoadingStates] = useState<boolean>(false);
    const [loadingCities, setLoadingCities] = useState<boolean>(false);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [message, setMessage] = useState<string | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const {
        control,
        handleSubmit,
        formState: {errors},
        setValue,
        getValues,
        setError,
        trigger
    } = useForm<SignUpFormFields>({
        mode: 'onBlur',
        resolver: yupResolver(schema),
        shouldUseNativeValidation: false,
        defaultValues: {
            bornAt: null,
            phone: '',
        }
    });
    const onSubmit = async (data: SignUpFormFields) => {
        setMessage(null);
        setLoading(true);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/users`, {
                name: data.name,
                born_at: data.bornAt,
                email: data.email,
                ibge_city_id: data.city,
                phone: parsePhoneNumber(data.phone, 'BR').number,
                password: data.password,
                password_confirmation: data.passwordConfirmation,
            });
        } catch (e) {
            const error = e as AxiosError<{ message?: string, errors?: { [Property in SignUpFormField]?: string[] } }>;

            if (error.response?.data.message) {
                setMessage(error.response.data.message);
            }

            if (error.response?.data.errors) {
                (Object.keys(error.response.data.errors) as Array<SignUpFormField>)
                    .filter(field => {
                        const fieldErrors = error.response?.data?.errors?.[field];

                        return fieldErrors && fieldErrors.length > 0;
                    })
                    .forEach(field => {
                        setError(field, {
                            message: error.response?.data?.errors?.[field]?.[0]
                        });
                    });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getStates = async () => {
            setLoadingStates(true);

            try {
                const {data} = await axios.get<State[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');

                setStates(data.map((state: State) => ({...state, label: state.nome})));

            } catch (e) {

            } finally {
                setLoadingStates(false);
            }
        };

        getStates();
    }, [])

    const getCities = async (initials: string) => {
        setLoadingCities(true);

        try {
            const {data} = await axios.get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${initials}/municipios?orderBy=nome`);

            setCities(data.map((city) => ({...city, label: city.nome})));
        } catch (e) {

        } finally {
            setLoadingCities(false);
        }
    };

    return (
        <>
            <Head>
                <title>MiAudote - Cadastro</title>
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
                                            <Grid item xs={12}>
                                                <Typography variant="h1" textAlign="center">MiAudote</Typography>
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
                                                            value={getValues().bornAt}
                                                            onChange={(bornAt) => setValue('bornAt', bornAt)}
                                                            onAccept={() => trigger('bornAt')}
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
                                                            value: new AsYouType('BR').input(field.value),
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
                                                    autoComplete
                                                    disabled={loadingStates || states.length === 0}
                                                    onChange={async (event, state: State | null) => {
                                                        const initials = state?.sigla ?? null;

                                                        setValue('state', initials);
                                                        setValue('city', null);

                                                        if (initials) {
                                                            await getCities(initials);
                                                        }
                                                    }}
                                                    onBlur={() => trigger('state')}
                                                    disablePortal
                                                    options={states}
                                                    renderInput={(params) => <TextField {...params} variant="filled"
                                                                                        fullWidth label="Estado"
                                                                                        error={!!errors.state}
                                                                                        helperText={errors.state?.message}/>
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    autoComplete
                                                    disabled={loadingCities || cities.length === 0}
                                                    onChange={(event, city) => setValue('city', city?.id ?? null)}
                                                    onBlur={() => trigger('city')}
                                                    disablePortal
                                                    options={cities}
                                                    renderInput={(params) => <TextField {...params} variant="filled"
                                                                                        fullWidth label="Cidade"
                                                                                        error={!!errors.city}
                                                                                        helperText={errors.city?.message}/>
                                                    }
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
                                                <Controller
                                                    name="password"
                                                    control={control}
                                                    render={({field}) => <TextField {...field} label="Senha"
                                                                                    type="password"
                                                                                    variant="filled"
                                                                                    fullWidth error={!!errors.password}
                                                                                    helperText={errors.password?.message}/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Controller
                                                    name="passwordConfirmation"
                                                    control={control}
                                                    render={({field}) => <TextField {...field}
                                                                                    label="Confirmação de Senha"
                                                                                    type="password" variant="filled"
                                                                                    fullWidth
                                                                                    error={!!errors.passwordConfirmation}
                                                                                    helperText={errors.passwordConfirmation?.message}/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <LoadingButton fullWidth variant="contained" size="large" type="submit"
                                                               loading={loading}>
                                                    Cadastrar
                                                </LoadingButton>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Link href="/login" passHref>
                                                    <Button fullWidth size="large" type="submit">
                                                        Já tem uma conta? Entrar
                                                    </Button>
                                                </Link>
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

export default SignUp;