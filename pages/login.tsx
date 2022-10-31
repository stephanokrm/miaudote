import {NextPage} from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PetsIcon from '@mui/icons-material/Pets';
import Head from 'next/head';
import Link from 'next/link';
import LoadingButton from '@mui/lab/LoadingButton';
import useForm from '../src/hooks/useForm';
import Alert from '@mui/material/Alert';
import {useLoginMutation} from '../src/hooks/mutations/useLoginMutation';
import {UserLoginFieldValues} from '../src/types';
import {ControlledTextField} from '../src/components/ControlledTextField';
import {useUserLoginSchema} from '../src/hooks/schemas/useUserLoginSchema';

const Login: NextPage = () => {
  const schema = useUserLoginSchema();
  const {control, handleSubmit, setError} = useForm<UserLoginFieldValues>({
    schema,
  });
  const {mutate, isLoading, message} = useLoginMutation({setError});
  const onSubmit = handleSubmit((user) => mutate(user));

  return (
      <>
        <Head>
          <title>MiAudote - Login</title>
        </Head>
        <Container maxWidth="sm" disableGutters>
          <Box paddingY={10}>
            <Grid container justifyContent="center" alignContent="center"
                  spacing={2}>
              <Grid item>
                <Card>
                  <CardContent>
                    <form onSubmit={onSubmit}>
                      <Grid container spacing={2} justifyContent="center"
                            textAlign="center">
                        <Grid item xs={12}>
                          <PetsIcon fontSize="large" color="primary"/>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                              variant="h2"
                              sx={{
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                              }}
                          >
                            MIAUDOTE
                          </Typography>
                        </Grid>
                        {message && (
                            <Grid item xs={12}>
                              <Alert severity="error">{message}</Alert>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                          <ControlledTextField
                              name="email"
                              type="email"
                              label="E-mail"
                              control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <ControlledTextField
                              name="password"
                              type="password"
                              label="Senha"
                              control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <LoadingButton
                              fullWidth
                              loading={isLoading}
                              size="large"
                              type="submit"
                              variant="contained"
                          >
                            Entrar
                          </LoadingButton>
                        </Grid>
                        <Grid item xs={12}>
                          <Link href="/user/create" passHref>
                            <Button fullWidth size="large">
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
