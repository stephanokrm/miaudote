import {GetServerSideProps, NextPage} from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PetsIcon from '@mui/icons-material/Pets';
import Head from "next/head";
import Link from "next/link";
import {Controller} from "react-hook-form";
import LoadingButton from '@mui/lab/LoadingButton';
import * as yup from "yup";
import axios from "../src/axios";
import useForm from '../src/hooks/useForm';
import useService from "../src/hooks/useService";
import Alert from "@mui/material/Alert";
import {useRouter} from "next/router";
import useUser, {Middleware} from "../src/hooks/useUser";
import guestMiddleware from "../src/guestMiddleware";
import {useCookies} from "react-cookie";

const schema = yup.object({
    email: yup.string().email('O campo e-mail deve ser um endereço de e-mail válido.').required('O campo e-mail é obrigatório.'),
    password: yup.string().required('O campo senha é obrigatório.'),
}).required();

type LoginFormValues = {
    email: string,
    password: string,
};

const Login: NextPage = () => {
    const router = useRouter();
    const [cookies, setCookie] = useCookies(['access_token']);
    const {refetch} = useUser({middleware: Middleware.GUEST, redirectIfAuthenticated: '/'});
    const {control, handleSubmit, setError, formState: {errors}} = useForm<LoginFormValues>({schema});
    const {message, loading, onSubmit} = useService<LoginFormValues>({
        setError,
        handler: async (data: LoginFormValues) => {
            const {data: token} = await axios.post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/oauth/token`, {
                grant_type: 'password',
                client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
                username: data.email,
                password: data.password,
            });

            setCookie('access_token', token.access_token);
            localStorage.setItem('access_token', token.access_token);

            await refetch();
            await router.push('/');
        }
    })

    return (
        <>
            <Head>
                <title>MiAudote - Login</title>
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
                                                <LoadingButton fullWidth variant="contained" size="large" type="submit"
                                                               loading={loading}>
                                                    Entrar
                                                </LoadingButton>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Link href="/signup" passHref>
                                                    <Button fullWidth size="large" type="submit">
                                                        Não tem uma conta? Cadastrar-se
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

export const getServerSideProps: GetServerSideProps = guestMiddleware;

export default Login;
