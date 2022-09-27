import {NextPage} from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import {format, subYears} from "date-fns";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Switch} from "@mui/material";

// private Integer id;
// private String nome;
// private Integer idade;
// private Integer porte;
// private Integer cor;
// private Integer especie;
// private Integer temperamento;
// private Boolean castrado;
// private Integer sexo;
// private Integer raca;
// private Integer idCadastrante;
// private Integer condicaoEstadia;
// private String descricao;
// private Boolean amigavelCrianca;
// private Boolean patio;
// private List<String> urlImgs;

const minDate = subYears(new Date(), 30);
const maxDate = subYears(new Date(), 0);
const schema = yup.object({
    name: yup.string().required('O campo nome é obrigatório.'),
    birthdate: yup.date().nullable().required('O campo mês de nascimento é obrigatório.').min(minDate, 'O campo mês de nascimento deve ser maior que ' + format(minDate, 'MM/yyyy') + '.').max(maxDate, 'O campo mês de nascimento deve ser maior que hoje.'),
    size: yup.string(),
    color: yup.string(),
    species: yup.string(),
    temperament: yup.string(),
    castrated: yup.boolean(),
    gender: yup.string(),
    breed: yup.string(),
    conditionsOfStay: yup.string(),
    description: yup.string(),
    friendlyWithChildren: yup.boolean(),
    yard: yup.boolean(),
}).required();

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
                                                        label="Mês de nascimento"
                                                        inputFormat="MM/yyyy"
                                                        value={getValues().birthdate}
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
                                                render={({field}) => <TextField {...field} multiline label="Descrição"
                                                                                variant="filled"
                                                                                fullWidth error={!!errors.description}
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