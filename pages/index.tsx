import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import {NextPage} from 'next'
import Head from 'next/head'
import Container from "@mui/material/Container";
import AnimalCard from "../src/components/AnimalCard";
import useGetAnimalsQuery from "../src/hooks/queries/useGetAnimalsQuery";
import {ListHeader} from '../src/components/ListHeader';

const Home: NextPage = () => {
    const {data: animals, isLoading, isError, isFetched, isRefetching} = useGetAnimalsQuery();

    return (
        <>
          <Head>
            <title>MiAudote - Doações</title>
          </Head>
          <Container maxWidth="xl">
            <Grid container spacing={2} sx={{marginY: 2}}>
              <Grid item xs={12} display="flex" alignItems="center">
                <ListHeader label="Doações" loading={isLoading || isRefetching}/>
              </Grid>
              {isError && (
                  'ERRO'
              )}
              {isFetched && animals?.length === 0 && (
                  <Grid item xs={12} textAlign="center">
                    <SentimentDissatisfiedIcon fontSize="large"/>
                    <Typography variant="h4" color="white">Nenhuma doação
                      disponível</Typography>
                  </Grid>
              )}
              {isFetched && animals?.map((animal) => (
                  <Grid item key={animal.name} xs={12} sm={6} md={4} lg={3}
                        xl={2}>
                    <AnimalCard animal={animal}/>
                  </Grid>
              ))}
            </Grid>
          </Container>
        </>
    )
}

export default Home
