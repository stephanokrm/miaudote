import {FC} from 'react';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import {parseISO, subYears} from 'date-fns';
import {AsYouType} from 'libphonenumber-js';
import {AvatarChangeEvent, InteractableAvatar} from './InteractableAvatar';
import {User, UserEditFieldValues} from '../types';
import useForm from '../hooks/useForm';
import {useUserUpdateMutation} from '../hooks/mutations/useUserUpdateMutation';
import {
  useGetCitiesByStateQuery,
} from '../hooks/queries/useGetCitiesByStateQuery';
import {useGetStatesQuery} from '../hooks/queries/useGetStatesQuery';
import {ControlledTextField} from './ControlledTextField';
import {ControlledDatePicker} from './ControlledDatePicker';
import {useUserEditSchema} from '../hooks/schemas/useUserEditSchema';
import {ControlledAutocomplete} from './ControlledAutocomplete';

type UserEditFormProps = {
  user: User,
};

const minDate = subYears(new Date(), 100);
const maxDate = subYears(new Date(), 18);

export const UserEditForm: FC<UserEditFormProps> = (props) => {
  const {user} = props;

  const schema = useUserEditSchema({minDate, maxDate});
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    trigger,
    watch,
  } = useForm<UserEditFieldValues>({
    schema,
    defaultValues: {
      ...user,
      bornAt: parseISO(user.bornAtISO),
    },
  });

  const {
    mutate: updateUser,
    message: updateUserMessage,
    isLoading: isUpdatingUser,
  } = useUserUpdateMutation({setError});
  const {data: states, isLoading: isLoadingStates} = useGetStatesQuery();
  const {
    data: cities,
    isLoading: isLoadingCities,
  } = useGetCitiesByStateQuery(watch('city.state')?.initials);

  const onSubmit = handleSubmit(
      (data: UserEditFieldValues) => updateUser(data));

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
          <Grid
              item
              xs={12}
              justifyContent="center"
              display="flex"
          >
            <InteractableAvatar
                onChange={onAvatarChange}
                alt={watch('name')}
                src={watch('avatar')}
            />
          </Grid>
          {updateUserMessage && (
              <Grid item xs={12}>
                <Alert severity="error">{updateUserMessage}</Alert>
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
            <LoadingButton
                fullWidth
                loading={isUpdatingUser}
                size="large"
                type="submit"
                variant="contained"
            >
              Atualizar
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
  );
};