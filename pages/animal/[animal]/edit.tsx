import {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PetsIcon from '@mui/icons-material/Pets';
import CircularProgress from '@mui/material/CircularProgress';
import {useGetAnimalQuery} from '../../../src/hooks/queries/useGetAnimalQuery';
import {AnimalEditForm} from '../../../src/components/AnimalEditForm';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Fab from '@mui/material/Fab';
import {ChangeEvent} from 'react';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import {InteractableImage} from '../../../src/components/InteractableImage';
import {
  useImageDestroyMutation
} from '../../../src/hooks/mutations/useImageDestroyMutation';
import {
  useAnimalImageStoreMutation
} from '../../../src/hooks/mutations/useAnimalImageStoreMutation';
import {
  useGetImagesByAnimalQuery
} from '../../../src/hooks/queries/useGetImagesByAnimalQuery';

const AnimalEdit: NextPage = () => {
  const {query} = useRouter();
  const {data: animal, isLoading: isLoadingAnimal} = useGetAnimalQuery(
      query.animal as string);

  const {data: images} = useGetImagesByAnimalQuery(animal?.id);
  const {
    mutate: destroyAnimalImage,
    isLoading: isDestroyingAnimalImage,
    message: destroyAnimalImageMessage,
  } = useImageDestroyMutation();
  const {
    mutate: storeAnimalImage,
    isLoading: isStoringAnimalImage,
    message: storeAnimalImageMessage,
  } = useAnimalImageStoreMutation(animal?.id);

  return (
      <>
        <Head>
          <title>MiAudote - {isLoadingAnimal
              ? 'Carregando...'
              : animal?.name}</title>
        </Head>
        <Grid container spacing={2} py={4}>
          <Grid item md={4}>
            <Card sx={{width: '100%'}}>
              <CardContent>
                <Box display="flex" paddingY={2} justifyContent="center"
                     textAlign="center">
                  <PetsIcon fontSize="large" color="primary"/>
                </Box>
                {isLoadingAnimal ? (
                    <Box display="flex" paddingY={2} justifyContent="center">
                      <CircularProgress/>
                    </Box>
                ) : null}
                {animal ? <AnimalEditForm animal={animal}/> : null}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} textAlign="center" my={2}>
                    <PetsIcon fontSize="large" color="primary"/>
                  </Grid>
                  {storeAnimalImageMessage || destroyAnimalImageMessage ? (
                      <Grid item xs={12}>
                        <Alert severity="error">
                          {storeAnimalImageMessage ?? destroyAnimalImageMessage}
                        </Alert>
                      </Grid>
                  ) : null}
                  <Grid item xs={12} md={4}>
                    <Box display="flex" justifyContent="center"
                         alignItems="center"
                         sx={{aspectRatio: '1 / 1'}}>
                      <Fab
                          color="primary"
                          aria-label="Upload Picture"
                          component="label"
                          disabled={isStoringAnimalImage}
                      >
                        <input
                            hidden
                            accept="image/*"
                            type="file"
                            onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                              const file = event.currentTarget.files?.[0];

                              if (!file) return;

                              await storeAnimalImage({file});
                            }}
                        />
                        {isStoringAnimalImage ? (
                            <CircularProgress color="secondary"/>
                        ) : (
                            <PhotoCameraIcon/>
                        )}
                      </Fab>
                    </Box>
                  </Grid>
                  {images?.map((image) => (
                      <Grid item xs={12} md={4} key={image.id}>
                        <InteractableImage
                            alt={animal?.name ?? ''}
                            onDelete={() => destroyAnimalImage(image)}
                            src={image.path}
                            disabled={isDestroyingAnimalImage}
                            loading={isDestroyingAnimalImage}
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

export default AnimalEdit;
