import Link from 'next/link';
import {
  differenceInMonths,
  differenceInYears,
  formatDuration,
  parseISO,
} from 'date-fns';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CakeIcon from '@mui/icons-material/Cake';
import {ptBR} from 'date-fns/locale';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import HealingIcon from '@mui/icons-material/Healing';
import {Animal} from '../types';
import {FC, ReactNode, useState} from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  useAnimalDestroyMutation,
} from '../hooks/mutations/useAnimalDestroyMutation';
import Gender from '../enums/Gender';
import {useTheme} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import {getAnimalGenderLabel, getAnimalMention} from '../utils';

type AnimalCardProps = {
  animal: Animal,
  editable?: boolean,
  CardHeader?: ReactNode,
};

const today = new Date();

export const AnimalCard: FC<AnimalCardProps> = (props) => {
  const {animal, editable = false, CardHeader = null} = props;
  const theme = useTheme();
  const theAnimal = getAnimalMention(animal);
  const bornAt = parseISO(animal.bornAtISO);
  const years = differenceInYears(today, bornAt);
  const months = differenceInMonths(today, bornAt);
  const [open, setOpen] = useState(false);
  const {
    mutate: destroyAnimal,
    isLoading: isDestroyingAnimal,
  } = useAnimalDestroyMutation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
  };

  const onDestroy = async () => {
    await destroyAnimal(animal);
    await handleClose();
  };

  return (
      <>
        <Card>
          {CardHeader}
          <Link
              href={{pathname: '/animal/[animal]', query: {animal: animal.id}}}
              passHref>
            <CardActionArea>
              <CardMedia
                  component="img"
                  image={animal.avatar}
                  alt={animal.name}
                  sx={{
                    borderRadius: '20px',
                    boxShadow: theme.shadows[4],
                    aspectRatio: '1 / 1',
                  }}
              />
              <CardContent>
                <Grid container columnSpacing={2} rowSpacing={1}>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="h5" noWrap>
                      {animal.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary"
                                noWrap>
                      <Box display="flex" alignContent="center">
                        <PlaceIcon fontSize="small" color="primary"/>
                        <Box paddingLeft={1}>
                          {animal.city.name} - {animal.city.state.initials}
                        </Box>
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" color="text.secondary">
                      <Box display="flex" alignContent="center">
                        <CakeIcon fontSize="small" color="primary"/>
                        <Box paddingLeft={1}>
                          {formatDuration({
                            years: years,
                            months: years === 0
                                ? (months === 0 ? 1 : months)
                                : 0,
                          }, {
                            locale: ptBR,
                            format: ['years', 'months'],
                          })}
                        </Box>
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" color="text.secondary">
                      <Box display="flex" alignContent="center">
                        {animal.gender === Gender.Male
                            ? <MaleIcon fontSize="small" color="primary"/>
                            : <FemaleIcon fontSize="small" color="primary"/>}
                        <Box paddingLeft={1}>
                          {getAnimalGenderLabel(animal)}
                        </Box>
                      </Box>
                    </Typography>
                  </Grid>
                  {animal.castrated ? (
                      <Grid item>
                        <Typography variant="subtitle2" color="text.secondary">
                          <Box display="flex" alignContent="center">
                            <HealingIcon fontSize="small" color="primary"/>
                            <Box paddingLeft={1}>
                              Castrado
                            </Box>
                          </Box>
                        </Typography>
                      </Grid>
                  ) : null}
                </Grid>
              </CardContent>
            </CardActionArea>
          </Link>
          {editable && (
              <CardActions>
                <IconButton color="error" onClick={handleClickOpen}>
                  <DeleteIcon/>
                </IconButton>
                <Link href={{
                  pathname: '/animal/[animal]/edit',
                  query: {animal: animal.id},
                }} passHref>
                  <IconButton color="primary">
                    <EditIcon/>
                  </IconButton>
                </Link>
              </CardActions>
          )}
        </Card>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Desativar doação {theAnimal}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Ao desativar a doação, a mesma não será mais exibida na
              plataforma. Você pode restaurá-la
              depois.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>Cancelar</Button>
            <LoadingButton color="error" loading={isDestroyingAnimal}
                           onClick={onDestroy}>
              Desativar
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </>
  );
};
