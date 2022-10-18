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
import {intlFormatDistance, parseISO} from "date-fns";
import getAnimals from "../../../src/services/getAnimals";

type AnimalShowProps = {
    animal: Animal,
}

export const getStaticPaths: GetStaticPaths = async () => {
     const animals = await getAnimals();

    return {
        paths: animals.map((animal: Animal) => ({ params: { animal: animal.id } } )),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<AnimalShowProps, { animal: string }> = async ({ params }) => {
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
                                        <Grid item xs={12}>
                                            <Grid container justifyContent="center" alignItems="center" spacing={2}>
                                                <Grid item xs={12} md={6} position="relative">
                                                    <Image
                                                        style={{
                                                            borderRadius: '25px',
                                                            width: '100%',
                                                            height: 'auto'
                                                        }}
                                                        loading="lazy"
                                                        alt={animal.name}
                                                        src={animal.avatar}
                                                        width="0"
                                                        height="0"
                                                        sizes="100vw"
                                                    />
                                                    {/*<Avatar alt={animal.name} src={animal.avatar}*/}
                                                    {/*        sx={{width: '100%', height: '100%'}}/>*/}
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="h3">{animal.name}</Typography>
                                                    <Typography variant="h6">{animal.city.name} - {animal.city.state.initials}</Typography>
                                                    <Typography variant="subtitle2" color="text.secondary">Adicionado por {animal?.user?.name} {intlFormatDistance(parseISO(animal.createdAtISO), new Date(), { locale: ptBR.code })}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            B
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
