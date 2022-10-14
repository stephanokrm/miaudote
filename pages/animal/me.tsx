import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import {NextPage} from 'next'
import Head from 'next/head'
import Container from "@mui/material/Container";
import AnimalCard from "../../src/components/AnimalCard";
import {useGetAnimalsByMeQuery} from "../../src/hooks/queries/useGetAnimalsByMeQuery";

const AnimalMe: NextPage = () => {
    const {data: animals, isLoading, isRefetching, isError, isFetched} = useGetAnimalsByMeQuery();

    return (
        <>
            <Head>
                <title>MiAudote - Minhas Doações</title>
            </Head>
            <Container maxWidth="lg">
                <Grid container component="main" spacing={2} justifyContent="center"
                      sx={{marginY: 2}}>
                    <Grid item xs={12} display="flex" alignItems="center">
                        <Typography variant="h5" color="white" mr={2}>Minhas Doações</Typography>
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
                            <Typography variant="h4" color="white">Nenhuma doação cadastrada</Typography>
                        </Grid>
                    )}
                    {isFetched && animals?.map((animal) => (
                        <Grid item key={animal.name} xs={12} sm={6} md={4} lg={3}>
                            <AnimalCard animal={animal} editable/>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}

export default AnimalMe
