import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SentimentDissatisfiedIcon
  from '@mui/icons-material/SentimentDissatisfied';
import {NextPage} from 'next';
import Head from 'next/head';
import {AnimalCard} from '../src/components/AnimalCard';
import useGetAnimalsQuery from '../src/hooks/queries/useGetAnimalsQuery';
import {ListHeader} from '../src/components/ListHeader';
import Fab from '@mui/material/Fab';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import {Chip, Theme, useMediaQuery} from '@mui/material';
import {useEffect, useState} from 'react';
import useForm from '../src/hooks/useForm';
import {
  AnimalFilterFieldValues, AnimalQuery, AnimalQueryParam,
} from '../src/types';
import {
  useAnimalFilterSchema,
} from '../src/hooks/schemas/useAnimalFilterSchema';
import {ControlledRadioGroup} from '../src/components/ControlledRadioGroup';
import Species from '../src/enums/Species';
import Gender from '../src/enums/Gender';
import {getGenderPrefix} from '../src/utils';
import IconButton from '@mui/material/IconButton';
import {useRouter} from 'next/router';

const chips = {
  castrated: {
    'true': 'Castrado',
    'false': 'Não Castrado',
  },
  gender: {
    [Gender.Female]: 'Fêmea',
    [Gender.Male]: 'Macho',
  },
  species: {
    [Species.Dog]: 'Cachorro',
    [Species.Cat]: 'Gato',
  },
};

const filters: AnimalQueryParam[] = ['castrated', 'gender', 'species'];

const Home: NextPage = () => {
  const router = useRouter();
  const query = router.query as AnimalQuery;
  const [open, setOpen] = useState(false);
  const schema = useAnimalFilterSchema();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm<AnimalQuery>({schema});
  const {
    data: animals,
    isLoading,
    isError,
    isFetched,
    isRefetching,
  } = useGetAnimalsQuery(query);

  useEffect(() => {
    filters.forEach(filter => setValue(filter, query[filter]));
  }, [query, setValue]);

  const fullScreen = useMediaQuery(
      (theme: Theme) => theme.breakpoints.down('md'),
  );

  const onSubmit = handleSubmit(async (data: AnimalFilterFieldValues) => {
    filters.forEach(filter => router.query[filter] = data[filter] ?? '');

    await router.push(router);

    handleClose();
  });
  const handleReset = async () => {
    router.query = {};

    await router.push(router);

    handleClose();
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChipDelete = async (param: AnimalQueryParam) => {
    router.query = {
      ...query,
      [param]: '',
    };

    await router.push(router);
  };

  const loading = isLoading || isRefetching;

  return (
      <>
        <Head>
          <title>MiAudote - Doações</title>
        </Head>
        <Grid container spacing={2} sx={{marginY: 2}}>
          <Grid item xs={12}>
            <Grid container>
              <Grid item display="flex" alignItems="center">
                <ListHeader label="Doações"/>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <Fab
                    size="small"
                    aria-label="Filter"
                    onClick={handleClickOpen}
                    disabled={loading}
                >
                  {loading ? (
                      <CircularProgress color="primary" size={25}/>
                  ) : (
                      <FilterAltTwoToneIcon/>
                  )}
                </Fab>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {filters.
                  map((filter) =>
                      query[filter] ? (
                          <Grid key={filter} item>
                            <Chip
                                // @ts-ignore
                                label={chips[filter][query[filter]]}
                                color="secondary"
                                onDelete={() => handleChipDelete(filter)}
                            />
                          </Grid>
                      ) : null)
              }
            </Grid>
          </Grid>
          {isError && (
              'ERRO'
          )}
          {isFetched && animals?.length === 0 && (
              <Grid item xs={12} textAlign="center">
                <SentimentDissatisfiedIcon fontSize="large"/>
                <Typography variant="h4" color="white">Nenhuma doação
                  disponível</Typography>
              </Grid>
          )}
          {isFetched && animals?.map((animal) => (
              <Grid item key={animal.name} xs={12} sm={6} md={4} lg={3}>
                <AnimalCard animal={animal}/>
              </Grid>
          ))}
        </Grid>
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            scroll="paper"
        >
          <form onSubmit={onSubmit}>
            <DialogTitle id="responsive-dialog-title">
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <IconButton
                      edge="start"
                      color="inherit"
                      onClick={handleClose}
                      aria-label="close"
                  >
                    <CloseIcon/>
                  </IconButton>
                </Grid>
                <Grid item>
                  Filtros
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <ControlledRadioGroup
                      control={control}
                      name="species"
                      label="Espécie"
                      options={[
                        {label: 'Gato', value: Species.Cat},
                        {label: 'Cachorro', value: Species.Dog},
                      ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ControlledRadioGroup
                      control={control}
                      name="gender"
                      label="Sexo"
                      options={[
                        {label: 'Fêmea', value: Gender.Female},
                        {label: 'Macho', value: Gender.Male},
                      ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ControlledRadioGroup
                      control={control}
                      name="castrated"
                      label={
                        `Castrad${getGenderPrefix(watch('gender'))}`
                      }
                      options={[
                        {label: 'Sim', value: 'true'},
                        {label: 'Não', value: 'false'},
                      ]}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleReset}>
                Limpar
              </Button>
              <Button autoFocus variant="contained" type="submit">
                Filtrar
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </>
  );
};

export default Home;
