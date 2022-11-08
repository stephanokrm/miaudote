import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SentimentDissatisfiedIcon
  from '@mui/icons-material/SentimentDissatisfied';
import {NextPage} from 'next';
import Head from 'next/head';
import {
  useGetAnimalsByMeQuery,
} from '../../src/hooks/queries/useGetAnimalsByMeQuery';
import {ListHeader} from '../../src/components/ListHeader';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import {AnimalMeCard} from '../../src/components/AnimalCard/AnimalMeCard';

const AnimalMe: NextPage = () => {
  const {
    data: animals,
    isLoading,
    isRefetching,
    isError,
    isFetched,
  } = useGetAnimalsByMeQuery();

  const loading = isLoading || isRefetching;

  return (
      <>
        <Head>
          <title>MiAudote - Minhas Doações</title>
        </Head>
        <Grid container spacing={2} sx={{marginY: 2}}>
          <Grid item xs={12}>
            <Grid container>
              <Grid item display="flex" alignItems="center">
                <ListHeader label="Minhas Doações"/>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <Link href="/animal/create" passHref>
                  <Fab
                      size="small"
                      aria-label="Filter"
                      disabled={loading}
                  >
                    {loading ? (
                        <CircularProgress color="primary" size={25}/>
                    ) : (
                        <AddIcon/>
                    )}
                  </Fab>
                </Link>
              </Grid>
            </Grid>
          </Grid>
          {isError && (
              'ERRO'
          )}
          {isFetched && animals?.length === 0 && (
              <Grid item xs={12} textAlign="center">
                <SentimentDissatisfiedIcon fontSize="large"/>
                <Typography variant="h4" color="white">
                  Nenhuma doação cadastrada
                </Typography>
              </Grid>
          )}
          {isFetched && animals?.map((animal) => (
              <Grid
                  item
                  key={animal.id}
                  display="flex"
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
              >
                <AnimalMeCard animal={animal}/>
              </Grid>
          ))}
        </Grid>
      </>
  );
};

export default AnimalMe;
