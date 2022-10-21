import {
  GetServerSideProps,
  NextPage,
} from 'next';
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
import {
  intlFormatDistance,
  parseISO,
} from 'date-fns';
import Avatar from '@mui/material/Avatar';
import Gender from '../../../src/enums/Gender';
import PetsIcon from '@mui/icons-material/Pets';
import AnimalCard from '../../../src/components/AnimalCard';

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
                          variant="h6">Sobre {animal.gender === Gender.Male
                          ? 'o'
                          : 'a'} {animal.name}</Typography>
                      <Typography
                          variant="body1">{animal.description}</Typography>
                    </Grid>
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
