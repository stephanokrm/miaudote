import {GetServerSideProps, NextPage} from "next";
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
import {Controller} from "react-hook-form";
import * as yup from "yup";
import {format, subYears} from 'date-fns';
import {AsYouType} from "libphonenumber-js";
import useForm from "../../src/hooks/useForm";
import {State, UserStoreFieldValues} from "../../src/types";
import getStates from "../../src/services/getStates";
import {ChangeEvent} from "react";
import {AvatarChangeEvent, InteractableAvatar} from "../../src/components/InteractableAvatar";
import {useGetCitiesByStateQuery} from "../../src/hooks/queries/useGetCitiesByStateQuery";
import {useUserStoreMutation} from "../../src/hooks/mutations/useUserStoreMutation";

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
    city: yup.object({
        id: yup.number().required(),
        name: yup.string().required(),
        label: yup.string().required(),
        state: stateObject,
    }).nullable().required('O campo cidade é obrigatório.'),
    password: yup.string().required('O campo senha é obrigatório.'),
    passwordConfirmation: yup.string().required('O campo confirmação de senha é obrigatório.').oneOf([yup.ref('password'), null], 'O campo confirmação de senha não confere.'),
}).required();

type SignUpProps = {
    states: State[],
}

export const getServerSideProps: GetServerSideProps<SignUpProps> = async () => {
    return {
        props: {
            states: await getStates(),
        }
    }
}

const UserCreate: NextPage<SignUpProps> = ({states}: SignUpProps) => {
    const {
        control,
        handleSubmit,
        formState: {errors},
        setValue,
        getValues,
        trigger,
        setError,
        watch,
    } = useForm<UserStoreFieldValues>({
        // @ts-ignore
        schema,
        defaultValues: {
            bornAt: null,
            phone: '',
        }
    });
    const {mutate: storeUser, message, isLoading: isStoringUser} = useUserStoreMutation({setError});
    const {
        data: cities,
        isLoading: isLoadingCities,
        refetch: refetchCities
    } = useGetCitiesByStateQuery({state: getValues('city.state')});
    const onSubmit = handleSubmit((data: UserStoreFieldValues) => storeUser(data));

    const onAvatarChange = async ({file, avatar}: AvatarChangeEvent) => {
        if (!file || !avatar) {
            return setError('avatar', {
                message: 'Invalid upload',
            });
        }

        setValue('avatar', avatar);
        setValue('file', file);

        await trigger(['avatar', 'file']);
    }

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
                                    <form onSubmit={onSubmit}>
                                        <Grid container spacing={2} justifyContent="center">
                                            <Grid item xs={12} textAlign="center">
                                                <PetsIcon fontSize="large" color="primary"/>
                                            </Grid>
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
                                                            value={getValues('bornAt') ?? ''}
                                                            onChange={(bornAt) => {
                                                                if (bornAt) setValue('bornAt', bornAt)
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
                                                    render={({field}) => (
                                                        <TextField
                                                            {...field}
                                                            label="Celular"
                                                            variant="filled"
                                                            fullWidth
                                                            error={!!errors.phone}
                                                            helperText={errors.phone?.message}
                                                            onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                                                                field.onChange(new AsYouType('BR').input(event.target.value));
                                                            }}
                                                        />
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
                                                    disabled={isLoadingCities || cities?.length === 0}
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
