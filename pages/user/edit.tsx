import {NextPage} from 'next';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import {useGetUserByMeQuery} from '../../src/hooks/queries/useGetUserByMeQuery';
import {UserEditForm} from '../../src/components/UserEditForm';

const UserShow: NextPage = () => {
  const {data: user, isLoading: loadingUser} = useGetUserByMeQuery();

  return (
      <>
        <Head>
          <title>MiAudote - {loadingUser ? 'Carregando...' : user?.name}</title>
        </Head>
        <Container maxWidth="sm">
          <Box paddingY={3}>
            <Grid container justifyContent="center" alignContent="center"
                  spacing={2}>
              <Grid item>
                <Card>
                  <CardContent>
                    {loadingUser ? <CircularProgress/> : null}
                    {user ? <UserEditForm user={user}/> : null}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </>
  );
};

export default UserShow;
