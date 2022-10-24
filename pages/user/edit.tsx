import {NextPage} from 'next';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import PetsIcon from '@mui/icons-material/Pets';
import {useGetUserByMeQuery} from '../../src/hooks/queries/useGetUserByMeQuery';
import {UserEditForm} from '../../src/components/UserEditForm';

const UserShow: NextPage = () => {
  const {data: user, isLoading: isLoadingUser} = useGetUserByMeQuery();

  return (
      <>
        <Head>
          <title>MiAudote - {isLoadingUser ? 'Carregando...' : user?.name}</title>
        </Head>
        <Container maxWidth="sm">
          <Box paddingY={2} width="100%">
            <Card sx={{width: '100%'}}>
              <CardContent>
                <Box display="flex" paddingY={2} justifyContent="center" textAlign="center">
                  <PetsIcon fontSize="large" color="primary"/>
                </Box>
                {isLoadingUser ? (
                    <Box display="flex" paddingY={2} justifyContent="center">
                      <CircularProgress/>
                    </Box>
                ) : null}
                {user ? <UserEditForm user={user}/> : null}
              </CardContent>
            </Card>
          </Box>
        </Container>
      </>
  );
};

export default UserShow;
