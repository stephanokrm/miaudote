import {NextPage} from 'next';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PetsIcon from '@mui/icons-material/Pets';
import Head from 'next/head';
import Link from 'next/link';
import {subYears} from 'date-fns';
import {AsYouType} from 'libphonenumber-js';
import useForm from '../../src/hooks/useForm';
import {UserStoreFieldValues} from '../../src/types';
import {
  AvatarChangeEvent,
  InteractableAvatar,
} from '../../src/components/InteractableAvatar';
import {
  useGetCitiesByStateQuery,
} from '../../src/hooks/queries/useGetCitiesByStateQuery';
import {
  useUserStoreMutation,
} from '../../src/hooks/mutations/useUserStoreMutation';
import {useGetStatesQuery} from '../../src/hooks/queries/useGetStatesQuery';
import {ControlledTextField} from '../../src/components/ControlledTextField';
import {ControlledDatePicker} from '../../src/components/ControlledDatePicker';
import {
  ControlledAutocomplete,
} from '../../src/components/ControlledAutocomplete';
import {useUserCreateSchema} from '../../src/hooks/schemas/useUserCreateSchema';

const minDate = subYears(new Date(), 100);
const maxDate = subYears(new Date(), 18);

const UserCreate: NextPage = () => {
  const schema = useUserCreateSchema({minDate, maxDate});
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    setError,
    watch,
  } = useForm<UserStoreFieldValues>({
    schema,
    defaultValues: {
      bornAt: null,
    },
  });

  const {data: states, isLoading: isLoadingStates} = useGetStatesQuery();
  const {
    data: cities,
    isLoading: isLoadingCities,
  } = useGetCitiesByStateQuery(watch('city.state')?.initials);
  const {
    mutate: storeUser,
    message: storeUserMessage,
    isLoading: isStoringUser,
  } = useUserStoreMutation({setError});

  const onSubmit = handleSubmit(
      (data: UserStoreFieldValues) => storeUser(data));

  const onAvatarChange = async ({file, avatar}: AvatarChangeEvent) => {
    if (!file || !avatar) {
      return setError('avatar', {
        message: 'Invalid upload',
      });
    }

    setValue('avatar', avatar);
    setValue('file', file);

    await trigger(['avatar', 'file']);
  };

  return (
      <>
        <Head>
          <title>MiAudote - Cadastro</title>
        </Head>
        <Container maxWidth="sm" disableGutters>
          <Box paddingY={3}>
            <Grid container justifyContent="center" alignContent="center"
                  spacing={2}>
              <Grid item>
                <Card>
                  <CardContent>
                    <form onSubmit={onSubmit}>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} textAlign="center">
                          <PetsIcon fontSize="large" color="primary"/>
                        </Grid>
                        <Grid item xs={12} justifyContent="center"
                              display="flex">
                          <InteractableAvatar onChange={onAvatarChange}
                                              alt={watch('name')}
                                              src={watch('avatar')}/>
                        </Grid>
                        {storeUserMessage && (
                            <Grid item xs={12}>
                              <Alert severity="error">{storeUserMessage}</Alert>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                          <Typography variant="h5">Dados Pessoais</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <ControlledTextField
                              name="name"
                              label="Nome"
                              control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <ControlledDatePicker
                              control={control}
                              disableFuture
                              label="Data de Nascimento"
                              maxDate={maxDate}
                              minDate={minDate}
                              name="bornAt"
                              openTo="year"
                              views={['year', 'month', 'day']}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <ControlledTextField
                              name="phone"
                              label="Celular"
                              control={control}
                              transform={(value) => (
                                  new AsYouType('BR').input(value)
                              )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h5">Endereço</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <ControlledAutocomplete
                              name="city.state"
                              label="Estado"
                              control={control}
                              disabled={isLoadingStates || states?.length === 0}
                              options={states ?? []}
                              getOptionLabel={(state) => state.name}
                              onChange={(state) => {
                                setValue('city', {
                                  id: 0,
                                  name: '',
                                  state: state ?? {
                                    name: '',
                                    initials: '',
                                  },
                                });
                              }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <ControlledAutocomplete
                              name="city"
                              label="Cidade"
                              control={control}
                              loading={isLoadingCities}
                              disabled={isLoadingCities || cities?.length === 0}
                              options={cities ?? []}
                              getOptionLabel={(city) => city.name ?? ''}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h5">Usuário</Typography>
                        </Grid>
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
                          <ControlledTextField
                              name="passwordConfirmation"
                              type="password"
                              label="Confirmação de Senha"
                              control={control}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <LoadingButton fullWidth variant="contained"
                                         size="large" type="submit"
                                         loading={isStoringUser}>
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

export default UserCreate;
