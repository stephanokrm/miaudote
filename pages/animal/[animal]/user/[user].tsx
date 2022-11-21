import {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PetsIcon from '@mui/icons-material/Pets';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import {
  useGetAnswersByAnimalAndUserQuery,
} from '../../../../src/hooks/queries/useGetAnswersByAnimalAndUserQuery';
import {
  useGetAnimalQuery,
} from '../../../../src/hooks/queries/useGetAnimalQuery';
import {useGetUserQuery} from '../../../../src/hooks/queries/useGetUserQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';

const AnimalUser: NextPage = () => {
  const {query} = useRouter();
  const {
    data: animal,
    isLoading: isLoadingAnimal,
  } = useGetAnimalQuery(query.animal as string);
  const {
    data: user,
    isLoading: isLoadingUser,
  } = useGetUserQuery(query.user as string);
  const {
    data: answers,
    isLoading: isLoadingAnswers,
  } = useGetAnswersByAnimalAndUserQuery(animal, user);

  const isLoading = isLoadingAnimal || isLoadingUser || isLoadingAnswers;

  return (
      <>
        <Head>
          <title>
            MiAudote - Respostas
          </title>
        </Head>
        <Container maxWidth="md" disableGutters>
          <Box display="flex" paddingY={3} width="100%">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{width: '100%'}}>
                  <CardContent>
                    <form onSubmit={() => {}}>
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} textAlign="center">
                          <PetsIcon fontSize="large" color="primary"/>
                        </Grid>
                        <Grid item xs={12} display="flex"
                              justifyContent="center">
                          {isLoading ? (
                              <CircularProgress/>
                          ) : (
                              <Badge
                                  overlap="circular"
                                  anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                  }}
                                  badgeContent={
                                    <Avatar
                                        alt={user?.name}
                                        src={user?.avatar}
                                        sx={{
                                          width: 75,
                                          height: 75,
                                          border: `2px solid white`,
                                        }}
                                    />
                                  }
                              >
                                <Avatar
                                    alt={animal?.name}
                                    src={animal?.avatar}
                                    sx={{width: 125, height: 125}}
                                />
                              </Badge>
                          )}
                        </Grid>
                        {!isLoading ? (
                            <Grid item xs={12} mt={5}>
                              <Typography variant="h4">
                                Respostas do {user?.name} Sobre o {animal?.name}
                              </Typography>
                            </Grid>
                        ) : null}
                      </Grid>
                    </form>
                  </CardContent>
                </Card>
              </Grid>
              {answers?.map((answer, index) => (
                  <Grid key={answer.id} item display="flex" xs={12}>
                    <Card sx={{width: '100%'}}>
                      <CardContent>
                        <Typography variant="h6">
                          {index + 1}. {answer.question?.value}
                        </Typography>
                        <Typography variant="subtitle1">{answer.value}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </>
  );
};

export default AnimalUser;
