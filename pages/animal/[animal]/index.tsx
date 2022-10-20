import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import {Animal} from "../../../src/types";
import {getAnimal} from "../../../src/services/getAnimal";
import Head from "next/head";
import Container from "@mui/material/Container";
import {ptBR} from "date-fns/locale";
import Image from "next/image";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import {differenceInMonths, differenceInYears, formatDuration, intlFormatDistance, parseISO} from "date-fns";
import getAnimals from "../../../src/services/getAnimals";
import Avatar from "@mui/material/Avatar";
import Gender from "../../../src/enums/Gender";
import PetsIcon from "@mui/icons-material/Pets";
import PlaceIcon from '@mui/icons-material/Place';

type AnimalShowProps = {
    animal: Animal,
}

const today = new Date();

export const getStaticPaths: GetStaticPaths = async () => {
    const animals = await getAnimals();

    return {
        paths: animals.map((animal: Animal) => ({params: {animal: animal.id}})),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<AnimalShowProps, { animal: string }> = async ({params}) => {
    if (!params?.animal) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            animal: await getAnimal({animal: params.animal}),
        }
    }
};

const AnimalShow: NextPage<AnimalShowProps> = ({animal}: AnimalShowProps) => {
    const bornAt = parseISO(animal.bornAtISO);
    const years = differenceInYears(today, bornAt);
    const months = differenceInMonths(today, bornAt);

    return (
        <>
            <Head>
                <title>MiAudote - {animal.name}</title>
            </Head>
            <Container maxWidth="md">
                <Box paddingY={3} width="100%">
                    <Grid container justifyContent="center" alignContent="center" spacing={2}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Grid container justifyContent="center" alignContent="center" spacing={2}>
                                        <Grid item xs={12} textAlign="center">
                                            <PetsIcon fontSize="large" color="primary"/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container justifyContent="center" alignItems="center" spacing={2}>
                                                <Grid item xs={12} justifyContent="center" display="flex">
                                                    <Avatar alt={animal.name} src={animal.avatar}
                                                            sx={{width: 250, height: 250}}/>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container justifyContent="space-evenly" alignItems="center"
                                                          spacing={4}>
                                                        <Grid item xs={12} textAlign="center">
                                                            <Typography variant="h4">{animal.name}</Typography>
                                                            <Typography variant="h6" color="text.secondary">
                                                                <PlaceIcon sx={{marginRight: 1}}/>
                                                                {animal.city.name} - {animal.city.state.initials}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={4} textAlign="center">
                                                            <Typography variant="subtitle1">
                                                                {formatDuration({
                                                                    years: years,
                                                                    months: years === 0 ? (months === 0 ? 1 : months) : 0,
                                                                }, {
                                                                    locale: ptBR,
                                                                    format: ["years", "months"]
                                                                })}
                                                            </Typography>
                                                            <Typography variant="caption"
                                                                        color="text.secondary">Idade</Typography>
                                                        </Grid>
                                                        <Grid item xs={4} textAlign="center">
                                                            <Typography variant="subtitle1">
                                                                {animal.gender === Gender.Male ? "Macho" : "Fêmea"}
                                                            </Typography>
                                                            <Typography variant="caption"
                                                                        color="text.secondary">Sexo</Typography>
                                                        </Grid>
                                                        <Grid item xs={4} textAlign="center">
                                                            <Typography variant="subtitle1" noWrap>
                                                                {animal.breed.name}
                                                            </Typography>
                                                            <Typography variant="caption"
                                                                        color="text.secondary">Raça</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="h6">Sobre {animal.gender === Gender.Male ? 'o' : 'a'} {animal.name}</Typography>
                                            <Typography variant="body1">{animal.description}</Typography>
                                        </Grid>
                                        {animal.images?.map((image) => (
                                            <Grid item xs={12} md={4} key={image.id} position="relative">
                                                <Image
                                                    style={{
                                                        borderRadius: '25px',
                                                        width: '100%',
                                                        height: 'auto'
                                                    }}
                                                    loading="lazy"
                                                    alt={animal.name}
                                                    src={image.path}
                                                    width="0"
                                                    height="0"
                                                    sizes="100vw"
                                                />
                                            </Grid>
                                        ))}
                                        <Grid item xs={12}>
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid item>
                                                    <Avatar alt={animal?.user?.name}
                                                            src={animal?.user?.avatar}
                                                            sx={{width: 50, height: 50}}/>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="caption"
                                                                color="text.secondary">Adicionado {intlFormatDistance(parseISO(animal.createdAtISO), today, {locale: ptBR.code})} por</Typography>
                                                    <Typography variant="subtitle1">{animal.user?.name}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
};

export default AnimalShow;
