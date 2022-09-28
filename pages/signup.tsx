import {NextPage} from "next";
import LoadingButton from '@mui/lab/LoadingButton';
import Box from "@mui/material/Box";
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
import {useState} from "react";

const minDate = subYears(new Date(), 150);
const maxDate = subYears(new Date(), 18);
const schema = yup.object({
    name: yup.string().required('O campo nome é obrigatório.'),
    birthdate: yup.date().nullable().required('O campo data de nascimento é obrigatório.').min(minDate, 'O campo data de nascimento deve ser maior que ' + format(minDate, 'dd/MM/yyyy') + '.').max(maxDate, 'A sua idade deve ser maior que 18 anos.'),
    email: yup.string().email('O campo e-mail deve ser um endereço de e-mail válido.').required('O campo e-mail é obrigatório.'),
    password: yup.string().required('O campo senha é obrigatório.'),
    passwordConfirmation: yup.string().required('O campo confirmação de senha é obrigatório.').oneOf([yup.ref('password'), null], 'O campo confirmação de senha não confere.')
}).required();

type SignUpFormFields = {
    name: string,
    birthdate: Date | null,
    email: string,
    password: string,
    passwordConfirmation: string,
};

type SignUpFormField = keyof SignUpFormFields;

const SignUp: NextPage = () => {
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
            birthdate: null,
        }
    });
    const onSubmit = async (data: SignUpFormFields) => {
        setMessage(null);
        setLoading(true);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/users`, {
                name: data.name,
                email: data.email,
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
                                        <Grid container spacing={2} justifyContent="center" textAlign="center">
                                            <Grid item xs={12}>
                                                <PetsIcon fontSize="large" color="primary"/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="h1">MiAudote</Typography>
                                            </Grid>
                                            {message && (
                                                <Grid item xs={12}>
                                                    <Alert severity="error">{message}</Alert>
                                                </Grid>
                                            )}
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
                                                    name="birthdate"
                                                    control={control}
                                                    render={({field}) => {
                                                        return <DatePicker
                                                            label="Data de Nascimento"
                                                            inputFormat="dd/MM/yyyy"
                                                            value={getValues().birthdate}
                                                            onChange={(birthdate) => setValue('birthdate', birthdate)}
                                                            onAccept={() => trigger('birthdate')}
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
                                                                               error={!!errors.birthdate}
                                                                               helperText={errors.birthdate?.message}/>
                                                                )
                                                            }}
                                                        />
                                                    }}/>
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