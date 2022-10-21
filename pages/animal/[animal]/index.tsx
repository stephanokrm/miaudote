import {GetServerSideProps, NextPage} from 'next';
import {Animal} from '../../../src/types';
import {getAnimal} from '../../../src/services/getAnimal';
import Head from 'next/head';
import Container from '@mui/material/Container';
import {ptBR} from 'date-fns/locale';
import Image from 'next/image';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import {intlFormatDistance, parseISO} from 'date-fns';
import Avatar from '@mui/material/Avatar';
import PetsIcon from '@mui/icons-material/Pets';
import AnimalCard from '../../../src/components/AnimalCard';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import Slider from '@mui/material/Slider';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Stack from '@mui/material/Stack';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import {getGenderPrefix} from '../../../src/utils';

type AnimalShowProps = {
  animal: Animal,
}

const today = new Date();

export const getServerSideProps: GetServerSideProps<AnimalShowProps, { animal: string }> = async ({params}) => {
  if (!params?.animal) {
    return {
      notFound: true,
    };
  }

  try {
    const animal = await getAnimal({animal: params.animal});

    return {props: {animal}};
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

const AnimalShow: NextPage<AnimalShowProps> = ({animal}: AnimalShowProps) => {
  return (
      <>
        <Head>
          <title>MiAudote - {animal.name}</title>
        </Head>
        <Container maxWidth="xl">
          <Grid container spacing={2} sx={{marginY: 2}}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <AnimalCard animal={animal} CardHeader={(
                  <CardHeader
                      avatar={<Avatar alt={animal?.user?.name}
                                      src={animal?.user?.avatar}/>}
                      title={animal.user?.name}
                      subheader={intlFormatDistance(
                          parseISO(animal.createdAtISO),
                          today, {locale: ptBR.code})}
                  />
              )}/>
            </Grid>
            <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} textAlign="center">
                      <PetsIcon fontSize="large" color="primary"/>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                          variant="h5" display="flex" alignItems="center"
                          gutterBottom>
                        <DescriptionIcon color="primary" sx={{mr: 1}}/>
                        Sobre {getGenderPrefix(
                          animal.gender)} {animal.name}</Typography>
                      <Typography
                          variant="body1">{animal.description}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} lg={6}>
                          <Typography variant="body2" gutterBottom>O quão
                            brincalhão
                            é {getGenderPrefix(
                                animal.gender)} {animal.name}</Typography>
                          <Stack spacing={2} direction="row"
                                 alignItems="center">
                            <ThumbDownOffAltIcon/>
                            <Slider defaultValue={animal.playfulness}
                                    step={1}
                                    marks
                                    disabled
                                    min={1}
                                    max={5}/>
                            <ThumbUpOffAltIcon/>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <Typography variant="body2" gutterBottom>O quão
                            carinhoso com a
                            família
                            é {getGenderPrefix(
                                animal.gender)} {animal.name}</Typography>
                          <Stack spacing={2} direction="row"
                                 alignItems="center">
                            <ThumbDownOffAltIcon/>
                            <Slider defaultValue={animal.familyFriendly}
                                    step={1}
                                    marks
                                    disabled
                                    min={1}
                                    max={5}/>
                            <ThumbUpOffAltIcon/>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <Typography variant="body2" gutterBottom>O quão
                            bem {getGenderPrefix(
                                animal.gender)} {animal.name} se dá com outros
                            animais de estimação da casa</Typography>
                          <Stack spacing={2} direction="row"
                                 alignItems="center">
                            <ThumbDownOffAltIcon/>
                            <Slider defaultValue={animal.familyFriendly}
                                    step={1}
                                    marks
                                    disabled
                                    min={1}
                                    max={5}/>
                            <ThumbUpOffAltIcon/>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                    {animal.images && animal.images?.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="h5" display="flex"
                                      alignItems="center">
                            <PhotoLibraryIcon color="primary" sx={{mr: 1}}/>
                            Fotos
                          </Typography>
                        </Grid>
                    )}
                    {animal.images?.map((image) => (
                        <Grid item xs={12} md={4} key={image.id}
                              position="relative">
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
        </Container>
      </>
  );
};

export default AnimalShow;
