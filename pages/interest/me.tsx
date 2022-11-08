import {NextPage} from 'next';
import Head from 'next/head';
import Grid from '@mui/material/Grid';
import {ListHeader} from '../../src/components/ListHeader';
import Typography from '@mui/material/Typography';
import {
  useGetInterestsByMeQuery,
} from '../../src/hooks/queries/useGetInterestsByMeQuery';
import {InterestMeCard} from '../../src/components/AnimalCard/InterestMeCard';

const InterestMe: NextPage = () => {
  const {
    data: interests,
    isLoading,
    isRefetching,
    isFetched,
    isError,
  } = useGetInterestsByMeQuery();

  return (
      <>
        <Head>
          <title>MiAudote - Meus Interesses</title>
        </Head>
        <Grid container spacing={2} sx={{marginY: 2}}>
          <Grid item xs={12} display="flex" alignItems="center">
            <ListHeader label="Meus Interesses"
                        loading={isLoading || isRefetching}/>
          </Grid>
          {isError && (
              'ERRO'
          )}
          {isFetched && interests?.length === 0 && (
              <Grid item xs={12} textAlign="center">
                <Typography variant="h4" color="white">Seus interesses irão
                  aparecer aqui</Typography>
              </Grid>
          )}
          {isFetched && interests?.map((interest) => (
              <Grid
                  item
                  key={interest.id}
                  display="flex"
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
              >
                <InterestMeCard animal={interest}/>
              </Grid>
          ))}
        </Grid>
      </>
  );
};

export default InterestMe;