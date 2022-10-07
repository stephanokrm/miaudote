import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import {NextPage} from 'next'
import Head from 'next/head'
import useAnimals from "../src/hooks/useAnimals";
import Container from "@mui/material/Container";
import AnimalCard from "../src/components/AnimalCard";

const Home: NextPage = () => {
    const {animals, loading} = useAnimals();

    return (
        <>
            <Head>
                <title>MiAudote</title>
            </Head>
            <Container maxWidth="lg">
                <Grid container component="main" spacing={2} justifyContent="center"
                      sx={{marginTop: 4, marginBottom: 4}}>
                    {loading && (
                        <CircularProgress color="secondary"/>
                    )}
                    {!loading && animals.length === 0 && (
                        <Grid item xs={12} textAlign="center">
                            <SentimentDissatisfiedIcon fontSize="large"/>
                            <Typography variant="h4" color="white">Nenhuma doação disponível</Typography>
                        </Grid>
                    )}
                    {animals.map((animal) => (
                        <Grid item key={animal.name} xs={12} sm={6} md={4} lg={3}>
                            <AnimalCard animal={animal}/>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}

export default Home
