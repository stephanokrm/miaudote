import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import {NextPage} from 'next'
import Head from 'next/head'
import Container from "@mui/material/Container";
import AnimalCard from "../../../../src/components/AnimalCard";
import useUserAnimals from "../../../../src/hooks/useUserAnimals";

const UserAnimalIndex: NextPage = () => {
    const {animals, loading} = useUserAnimals();

    return (
        <>
            <Head>
                <title>MiAudote - Minhas Doações</title>
            </Head>
            <Container maxWidth="lg">
                <Grid container component="main" spacing={2} justifyContent="center"
                      sx={{marginY: 2}}>
                    <Grid item xs={12}>
                        <Typography variant="h5" color="white">Minhas Doações</Typography>
                    </Grid>
                    {loading && (
                        <CircularProgress color="secondary"/>
                    )}
                    {!loading && animals.length === 0 && (
                        <Grid item xs={12} textAlign="center">
                            <SentimentDissatisfiedIcon fontSize="large"/>
                            <Typography variant="h4" color="white">Nenhuma doação cadastrada</Typography>
                        </Grid>
                    )}
                    {animals.map((animal) => (
                        <Grid item key={animal.id} xs={12} sm={6} md={4} lg={3}>
                            <AnimalCard animal={animal} editable/>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}

export default UserAnimalIndex
