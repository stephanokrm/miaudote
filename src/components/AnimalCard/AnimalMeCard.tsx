import Link from 'next/link';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {FC, useState} from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import {Animal} from '../../types';
import {getAnimalMention} from '../../utils';
import {
  useAnimalDestroyMutation,
} from '../../hooks/mutations/useAnimalDestroyMutation';
import {AnimalCardContent} from './AnimalCardContent';

type AnimalMeCardProps = {
  animal: Animal,
};

export const AnimalMeCard: FC<AnimalMeCardProps> = (props) => {
  const {animal} = props;
  const theAnimal = getAnimalMention(animal);
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
          <AnimalCardContent animal={animal}/>
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
