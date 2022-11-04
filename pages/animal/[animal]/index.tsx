import {GetServerSideProps, NextPage} from 'next';
import {Animal, User} from '../../../src/types';
import {getAnimal} from '../../../src/services/getAnimal';
import Head from 'next/head';
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import PetsIcon from '@mui/icons-material/Pets';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';
import ChildCareSharpIcon from '@mui/icons-material/ChildCareSharp';
import Face6Icon from '@mui/icons-material/Face6';
import {getAnimalMention} from '../../../src/utils';
import Box from '@mui/material/Box';
import {
  useAnimalInterestStoreMutation,
} from '../../../src/hooks/mutations/useAnimalInterestStoreMutation';
import getUserByMe from '../../../src/services/getUserByMe';
import {
  AnimalShowCard,
} from '../../../src/components/AnimalCard/AnimalShowCard';

type AnimalShowProps = {
  animal: Animal,
  user: User | null,
}

export const getServerSideProps: GetServerSideProps<AnimalShowProps, { animal: string }> = async ({
  req,
  params,
}) => {
  if (!params?.animal) {
    return {
      notFound: true,
    };
  }

  try {
    const animal = await getAnimal({animal: params.animal});
    const user = req.cookies.authorization
        ? await getUserByMe({authorization: req.cookies.authorization})
        : null;

    return {props: {animal, user}};
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

const AnimalShow: NextPage<AnimalShowProps> = ({
  animal,
  user,
}: AnimalShowProps) => {
  const theAnimal = getAnimalMention(animal);
  const url = typeof window === 'undefined'
      ? `https://miaudote-alpha.vercel.app/animal/${animal.id}`
      : window.location.href;

  const {
    mutate,
    isLoading,
    isSuccess,
  } = useAnimalInterestStoreMutation(animal.id);

  return (
      <>
        <Head>
          {/*Primary Meta Tags*/}
          <title>MiAudote - {animal.name}</title>
          <meta name="title" content={`MiAudote - ${animal.name}`}/>
          <meta name="description" content={animal.description}/>
          {/*Open Graph / Facebook*/}
          <meta property="og:type" content="website"/>
          <meta property="og:url" content={url}/>
          <meta property="og:title" content={`MiAudote - ${animal.name}`}/>
          <meta property="og:description" content={animal.description}/>
          <meta property="og:image" content={animal.avatar}/>
          {/*Twitter*/}
          <meta property="twitter:card" content="summary_large_image"/>
          <meta property="twitter:url" content={url}/>
          <meta property="twitter:title" content={`MiAudote - ${animal.name}`}/>
          <meta property="twitter:description" content={animal.description}/>
          <meta property="twitter:image" content={animal.avatar}/>
        </Head>
        <Grid container spacing={2} sx={{marginY: 2}}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnimalShowCard animal={animal} user={user}/>
          </Grid>
          <Grid item xs={12} sm={6} md={8} lg={9}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} textAlign="center">
                    <PetsIcon fontSize="large" color="primary"/>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                        variant="h5"
                        display="flex"
                        alignItems="center"
                        gutterBottom
                    >
                      <DescriptionIcon color="primary" sx={{mr: 1}}/>
                      Sobre {theAnimal}
                    </Typography>
                    <Typography variant="body1">
                      {animal.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2} justifyContent="center">
                      <Grid item>
                        <Card variant="outlined">
                          <CardContent
                              sx={{paddingBottom: '16px !important'}}>
                            {animal.playfulness >= 3 ? (
                                <Box textAlign="center">
                                  <CelebrationIcon color="primary"/>
                                  <Typography
                                      variant="body2">Brincalhão</Typography>
                                </Box>
                            ) : (
                                <Box textAlign="center">
                                  <SelfImprovementIcon color="primary"/>
                                  <Typography
                                      variant="subtitle2">Calmo</Typography>
                                </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item>
                        <Card variant="outlined">
                          <CardContent
                              sx={{paddingBottom: '16px !important'}}>
                            {animal.familyFriendly >= 3 ? (
                                <Box textAlign="center">
                                  <FavoriteIcon color="primary"/>
                                  <Typography
                                      variant="body2">Carinhoso</Typography>
                                </Box>
                            ) : (
                                <Box textAlign="center">
                                  <DoNotTouchIcon color="primary"/>
                                  <Typography
                                      variant="subtitle2">Envergonhado</Typography>
                                </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item>
                        <Card variant="outlined">
                          <CardContent
                              sx={{paddingBottom: '16px !important'}}>
                            {animal.petFriendly >= 3 ? (
                                <Box textAlign="center">
                                  <PetsIcon color="primary"/>
                                  <Typography variant="body2">Amigável Com
                                    Animais</Typography>
                                </Box>
                            ) : (
                                <Box textAlign="center">
                                  <PetsIcon color="primary"/>
                                  <Typography variant="subtitle2">Prefere Ser
                                    o Único</Typography>
                                </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item>
                        <Card variant="outlined">
                          <CardContent
                              sx={{paddingBottom: '16px !important'}}>
                            {animal.childrenFriendly >= 3 ? (
                                <Box textAlign="center">
                                  <ChildCareSharpIcon color="primary"/>
                                  <Typography variant="body2">Amigável Com
                                    Crianças</Typography>
                                </Box>
                            ) : (
                                <Box textAlign="center">
                                  <Face6Icon color="primary"/>
                                  <Typography variant="subtitle2">Prefere
                                    Adultos</Typography>
                                </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                  {animal.images && animal.images?.length > 0 && (
                      <Grid item xs={12}>
                        <Typography
                            alignItems="center"
                            display="flex"
                            gutterBottom
                            variant="h5"
                        >
                          <PhotoLibraryIcon color="primary" sx={{mr: 1}}/>
                          Fotos
                        </Typography>
                      </Grid>
                  )}
                </Grid>
                <Grid container spacing={1}>
                  {animal.images?.map((image) => (
                      <Grid
                          item
                          key={image.id}
                          lg={4}
                          md={6}
                          position="relative"
                          xs={12}
                      >
                        <Image
                            style={{
                              borderRadius: '20px',
                              width: '100%',
                              height: 'auto',
                            }}
                            loading="lazy"
                            alt={animal.name}
                            src={image.path}
                            width="0"
                            height="0"
                            sizes="100vw"
                        />
                      </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
  );
};

export default AnimalShow;
