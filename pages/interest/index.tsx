import {NextPage} from 'next';
import Head from 'next/head';
import Grid from '@mui/material/Grid';
import {ListHeader} from '../../src/components/ListHeader';
import SentimentDissatisfiedIcon
  from '@mui/icons-material/SentimentDissatisfied';
import Typography from '@mui/material/Typography';

const Interest: NextPage = () => {
  return (
      <>
        <Head>
          <title>MiAudote - Interessados</title>
        </Head>
        <Grid container spacing={2} sx={{marginY: 2}}>
          <Grid item xs={12} display="flex" alignItems="center">
            <ListHeader label="Meus Interesses" loading={true}/>
          </Grid>
        </Grid>
      </>
  );
};

export default Interest;