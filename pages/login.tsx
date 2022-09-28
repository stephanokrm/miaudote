import {NextPage} from "next";
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
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import axios from "axios";

const schema = yup.object({
    email: yup.string().email('O campo e-mail deve ser um endereço de e-mail válido.').required('O campo e-mail é obrigatório.'),
    password: yup.string().required('O campo senha é obrigatório.'),
}).required();

type LoginFormValues = {
    email: string,
    password: string,
};

const Login: NextPage = () => {
    const {control, handleSubmit, formState: {errors}} = useForm<LoginFormValues>({
        mode: 'onChange',
        resolver: yupResolver(schema),
        shouldUseNativeValidation: false,
    });
    const onSubmit = async (data: LoginFormValues) => {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/oauth/token`, {
            grant_type: 'password',
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            username: data.email,
            password: data.password,
        });
    };

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
                                        <Grid item xs={12}>
                                            <Controller
                                                name="email"
                                                control={control}
                                                render={({field}) => <TextField {...field} label="E-mail" type="email"
                                                                                variant="filled"
                                                                                fullWidth error={!!errors.email}
                                                                                helperText={errors.email?.message}/>}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Controller
                                                name="password"
                                                control={control}
                                                render={({field}) => <TextField {...field} label="Senha" type="password"
                                                                                variant="filled"
                                                                                fullWidth error={!!errors.password}
                                                                                helperText={errors.password?.message}/>}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button fullWidth variant="contained" size="large" type="submit">
                                                Entrar
                                            </Button>
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

export default Login;