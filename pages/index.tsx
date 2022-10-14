import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import {NextPage} from 'next'
import Head from 'next/head'
import Container from "@mui/material/Container";
import AnimalCard from "../src/components/AnimalCard";
import useGetAnimalsQuery from "../src/hooks/queries/useGetAnimalsQuery";

const Home: NextPage = () => {
    const {data: animals, isLoading, isError, isFetched, isRefetching} = useGetAnimalsQuery();

    return (
        <>
            <Head>
                <title>MiAudote - Doações</title>
            </Head>
            <Container maxWidth="lg">
                <Grid container component="main" spacing={2} justifyContent="center"
                      sx={{marginTop: 4, marginBottom: 4}}>
                    <Grid item xs={12} display="flex" alignItems="center">
                        <Typography variant="h5" color="white" mr={2}>Doações</Typography>
                        {isRefetching && <CircularProgress color="secondary" size={25}/>}
                    </Grid>
                    {isLoading && (
                        <CircularProgress color="secondary"/>
                    )}
                    {isError && (
                        'ERRO'
                    )}
                    {isFetched && animals?.length === 0 && (
                        <Grid item xs={12} textAlign="center">
                            <SentimentDissatisfiedIcon fontSize="large"/>
                            <Typography variant="h4" color="white">Nenhuma doação disponível</Typography>
                        </Grid>
                    )}
                    {isFetched && animals?.map((animal) => (
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
