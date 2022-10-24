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
import {AnimalCard} from '../../../src/components/AnimalCard';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import Slider from '@mui/material/Slider';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Stack from '@mui/material/Stack';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import {getAnimalMention} from '../../../src/utils';

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
  const theAnimal = getAnimalMention(animal);

  return (
      <>
        <Head>
          <title>MiAudote - {animal.name}</title>
        </Head>
        <Container maxWidth="xl">
          <Grid container spacing={2} sx={{marginY: 2}}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <AnimalCard animal={animal} CardHeader={(
                  <CardHeader
                      avatar={(
                          <Avatar
                              alt={animal?.user?.name}
                              src={animal?.user?.avatar}
                          />
                      )}
                      title={animal.user?.name}
                      subheader={intlFormatDistance(
                          parseISO(animal.createdAtISO),
                          today, {locale: ptBR.code})}
                  />
              )}/>
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
                          variant="h5" display="flex" alignItems="center"
                          gutterBottom>
                        <DescriptionIcon color="primary" sx={{mr: 1}}/>
                        Sobre {theAnimal}</Typography>
                      <Typography
                          variant="body1">{animal.description}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} lg={6}>
                          <Typography variant="body2" gutterBottom>
                            O quão brincalhão é {theAnimal}
                          </Typography>
                          <Stack
                              spacing={2}
                              direction="row"
                              alignItems="center"
                          >
                            <ThumbDownOffAltIcon color="primary"/>
                            <Slider
                                defaultValue={animal.playfulness}
                                step={1}
                                marks
                                disabled
                                min={1}
                                max={5}
                            />
                            <ThumbUpOffAltIcon color="primary"/>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <Typography variant="body2" gutterBottom>
                            O quão carinhoso com a família é {theAnimal}
                          </Typography>
                          <Stack
                              spacing={2}
                              direction="row"
                              alignItems="center"
                          >
                            <ThumbDownOffAltIcon color="primary"/>
                            <Slider
                                defaultValue={animal.familyFriendly}
                                step={1}
                                marks
                                disabled
                                min={1}
                                max={5}
                            />
                            <ThumbUpOffAltIcon color="primary"/>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <Typography variant="body2" gutterBottom>
                            O quão bem {theAnimal} se dá com outros animais de
                            estimação da casa
                          </Typography>
                          <Stack
                              spacing={2}
                              direction="row"
                              alignItems="center"
                          >
                            <ThumbDownOffAltIcon color="primary"/>
                            <Slider
                                defaultValue={animal.petFriendly}
                                step={1}
                                marks
                                disabled
                                min={1}
                                max={5}
                            />
                            <ThumbUpOffAltIcon color="primary"/>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <Typography variant="body2" gutterBottom>
                            O quão bem {theAnimal} se dá com crianças
                          </Typography>
                          <Stack
                              alignItems="center"
                              direction="row"
                              spacing={2}
                          >
                            <ThumbDownOffAltIcon color="primary"/>
                            <Slider
                                defaultValue={animal.childrenFriendly}
                                disabled
                                marks
                                max={5}
                                min={1}
                                step={1}
                            />
                            <ThumbUpOffAltIcon color="primary"/>
                          </Stack>
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
        </Container>
      </>
  );
};

export default AnimalShow;
