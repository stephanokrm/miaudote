import {NextPage} from 'next';
import Head from 'next/head';
import Grid from '@mui/material/Grid';
import {ListHeader} from '../../src/components/ListHeader';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SentimentDissatisfiedIcon
  from '@mui/icons-material/SentimentDissatisfied';
import Box from '@mui/material/Box';
import {useGetFormsQuery} from '../../src/hooks/queries/useGetFormsQuery';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';

const Form: NextPage = () => {
  const {data: forms = [], isLoading, isFetched} = useGetFormsQuery();

  return (
      <>
        <Head>
          <title>MiAudote - Formulários</title>
        </Head>
        <Grid container spacing={2} sx={{marginY: 2}}>
          <Grid item xs={12}>
            <Grid container>
              <Grid item display="flex" alignItems="center">
                <ListHeader label="Formulários"/>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <Link href="/form/create" passHref>
                  <Fab
                      size="small"
                      aria-label="Filter"
                      disabled={isLoading}
                  >
                    {isLoading ? (
                        <CircularProgress color="primary" size={25}/>
                    ) : (
                        <AddIcon/>
                    )}
                  </Fab>
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {forms?.length > 0 ? (
                <Card>
                  <CardContent sx={{padding: 0}}>
                    <List>
                      {forms.map((form, index) => (
                          <>

                          </>
                      ))}
                    </List>
                  </CardContent>
                </Card>
            ) : null}
            {isFetched && forms.length === 0 && (
                <Box textAlign="center">
                  <SentimentDissatisfiedIcon fontSize="large"/>
                  <Typography variant="h5" color="white">
                    Os formulários irão aparecer aqui
                  </Typography>
                </Box>
            )}
          </Grid>
        </Grid>
      </>
  );
};

export default Form;