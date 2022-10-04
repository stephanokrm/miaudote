import {NextPage} from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from '@mui/material/FormHelperText';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import {format, subYears} from "date-fns";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Switch} from "@mui/material";

const minDate = subYears(new Date(), 30);
const maxDate = subYears(new Date(), 0);
const schema = yup.object({
    name: yup.string().required('O campo nome é obrigatório.'),
    birthdate: yup.date().nullable().required('O campo mês de nascimento é obrigatório.').min(minDate, 'O campo mês de nascimento deve ser maior que ' + format(minDate, 'MM/yyyy') + '.').max(maxDate, 'O campo mês de nascimento deve ser maior que hoje.'),
    color: yup.string(),
    species: yup.string().oneOf(['DOG', 'CAT']).required('O campo espécie é obrigatório.'),
    gender: yup.string().oneOf(['MALE', 'FEMALE']).required('O campo sexo é obrigatório.'),
    breed: yup.string(),
    description: yup.string(),
});

type DonateFormValues = {
    name: string,
    birthdate: Date | null,
    size: string,
    color: string,
    species: string,
    temperament: string,
    castrated: boolean,
    gender: string,
    breed: string,
    conditionsOfStay: string,
    description: string,
    friendlyWithChildren: boolean,
    yard: boolean,
};

const Donate: NextPage = () => {
    const {control, handleSubmit, formState: {errors}, setValue, getValues} = useForm<DonateFormValues>({
        mode: 'onBlur',
        resolver: yupResolver(schema),
        shouldUseNativeValidation: false,
        defaultValues: {
            birthdate: null,
        },
    });
    const onSubmit = (data: DonateFormValues) => console.log(data);

    return (
        <>
            <Head>
                <title>MiAudote - Doar</title>
            </Head>
            <Container maxWidth="sm">
                <Box paddingY={3}>
                    <Grid container justifyContent="center" alignContent="center" spacing={2}>
                        <Grid item>
                            <Card>
                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Grid container spacing={2} justifyContent="center">
                                            <Grid item xs={12}>
                                                <Typography variant="h2">Doar</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl>
                                                    <FormLabel id="speciesLabel">Espécie</FormLabel>
                                                    <Controller name="species" control={control} render={({field}) => (
                                                        <RadioGroup
                                                            {...field}
                                                            aria-labelledby="speciesLabel"
                                                        >
                                                            <FormControlLabel value="CAT" control={<Radio/>}
                                                                              label="Gato"/>
                                                            <FormControlLabel value="DOG" control={<Radio/>}
                                                                              label="Cachorro"/>
                                                        </RadioGroup>
                                                    )}/>
                                                    {!!errors.species && (
                                                        <FormHelperText error>{errors.species?.message}</FormHelperText>
                                                    )}
                                                </FormControl>
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
                                                    name="birthdate"
                                                    control={control}
                                                    render={({field}) => {
                                                        return <DatePicker
                                                            label="Mês de Nascimento"
                                                            inputFormat="MM/yyyy"
                                                            value={getValues('birthdate')}
                                                            onChange={(birthdate) => setValue('birthdate', birthdate)}
                                                            disableFuture
                                                            openTo="year"
                                                            views={['year', 'month']}
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
                                                <FormControl>
                                                    <FormLabel id="genderLabel">Sexo</FormLabel>
                                                    <Controller name="gender" control={control} render={({field}) => (
                                                        <RadioGroup
                                                            {...field}
                                                            aria-labelledby="speciesLabel"
                                                        >
                                                            <FormControlLabel value="FEMALE" control={<Radio/>}
                                                                              label="Fêmea"/>
                                                            <FormControlLabel value="MALE" control={<Radio/>}
                                                                              label="Macho"/>
                                                        </RadioGroup>
                                                    )}/>
                                                    {!!errors.gender && (
                                                        <FormHelperText error>{errors.gender?.message}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Controller
                                                    name="castrated"
                                                    control={control}
                                                    render={({field}) => (
                                                        <FormControlLabel
                                                            control={<Switch
                                                                {...field}
                                                                checked={!!field.value}
                                                            />}
                                                            label="Castrado"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Controller
                                                    name="friendlyWithChildren"
                                                    control={control}
                                                    render={({field}) => (
                                                        <FormControlLabel
                                                            control={<Switch
                                                                {...field}
                                                                checked={!!field.value}
                                                            />}
                                                            label="Amigável com crianças"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Controller
                                                    name="yard"
                                                    control={control}
                                                    render={({field}) => (
                                                        <FormControlLabel
                                                            control={<Switch
                                                                {...field}
                                                                checked={!!field.value}
                                                            />}
                                                            label="Necessita de pátio"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Controller
                                                    name="description"
                                                    control={control}
                                                    render={({field}) => <TextField {...field} multiline
                                                                                    label="Descrição"
                                                                                    variant="filled"
                                                                                    rows={3}
                                                                                    fullWidth
                                                                                    error={!!errors.description}
                                                                                    helperText={errors.description?.message}/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button fullWidth variant="contained" size="large" type="submit">
                                                    Cadastrar
                                                </Button>
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

export default Donate;
