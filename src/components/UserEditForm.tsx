import {FC} from 'react';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {format, parseISO, subYears} from 'date-fns';
import {AsYouType} from 'libphonenumber-js';
import {AvatarChangeEvent, InteractableAvatar} from './InteractableAvatar';
import {User, UserUpdateFieldValues} from '../types';
import useForm from '../hooks/useForm';
import * as yup from 'yup';
import {useUserUpdateMutation} from '../hooks/mutations/useUserUpdateMutation';
import {
  useGetCitiesByStateQuery,
} from '../hooks/queries/useGetCitiesByStateQuery';
import {useGetStatesQuery} from '../hooks/queries/useGetStatesQuery';
import {ControlledTextField} from './ControlledTextField';
import {ControlledDatePicker} from './ControlledDatePicker';

type UserEditFormProps = {
  user: User,
};

const minDate = subYears(new Date(), 150);
const maxDate = subYears(new Date(), 18);
const stateObject = yup.object({
  name: yup.string().required(),
  initials: yup.string().required(),
  label: yup.string().required(),
});
const schema = yup.object({
  name: yup.string().required('O campo nome é obrigatório.'),
  bornAt: yup.date().
      required('O campo data de nascimento é obrigatório.').
      min(minDate, 'O campo data de nascimento deve ser maior que ' +
          format(minDate, 'dd/MM/yyyy') + '.').
      max(maxDate, 'A sua idade deve ser maior que 18 anos.'),
  email: yup.string().
      email('O campo e-mail deve ser um endereço de e-mail válido.').
      required('O campo e-mail é obrigatório.'),
  phone: yup.string().required('O campo celular é obrigatório.'),
  city: yup.object({
    id: yup.number().required(),
    name: yup.string().required(),
    label: yup.string().required(),
    state: stateObject,
  }).nullable().required('O campo cidade é obrigatório.'),
});

export const UserEditForm: FC<UserEditFormProps> = (props) => {
  const {user} = props;

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    getValues,
    setError,
    trigger,
    watch,
  } = useForm<UserUpdateFieldValues>({
    // @ts-ignore
    schema,
    defaultValues: {
      ...user,
      bornAt: parseISO(user.bornAtISO),
    },
  });

  const {
    mutate: updateUser,
    message,
    isLoading: isUpdatingUser,
  } = useUserUpdateMutation({setError});
  const {data: states, isLoading: isLoadingStates} = useGetStatesQuery();
  const {
    data: cities,
    isLoading: isLoadingCities,
    refetch: refetchCities,
    isRefetching: refethingCities,
  } = useGetCitiesByStateQuery(getValues('city.state').initials);

  const loading = isLoadingStates || isUpdatingUser || isLoadingCities ||
      refethingCities;
  const onSubmit = handleSubmit(
      (data: UserUpdateFieldValues) => updateUser(data));
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
      <form onSubmit={onSubmit}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} justifyContent="center" display="flex">
            <InteractableAvatar onChange={onAvatarChange} alt={watch('name')}
                                src={getValues('avatar')}/>
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
            <Autocomplete
                value={getValues('city.state') ?? ''}
                autoComplete
                disableClearable
                disabled={loading}
                onChange={async (event, state) => {
                  setValue('city', {
                    id: 0,
                    label: '',
                    name: '',
                    state,
                  });

                  await trigger('city');
                  await refetchCities();
                }}
                options={states ?? []}
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
                disabled={loading || cities?.length === 0}
                onChange={async (event, city) => {
                  setValue('city', city);

                  await trigger('city');
                }}
                options={cities ?? []}
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
            <LoadingButton fullWidth variant="contained" size="large"
                           type="submit"
                           loading={loading}>
              Atualizar
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
  );
};