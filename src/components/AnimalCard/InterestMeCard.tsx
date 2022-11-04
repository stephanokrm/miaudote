import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import {FC, useState} from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import {Animal} from '../../types';
import {AnimalCardContent} from './AnimalCardContent';
import Tooltip from '@mui/material/Tooltip';
import {AnimalCardHeader} from './AnimalCardHeader';
import {
  useInterestDestroyMutation,
} from '../../hooks/mutations/useInterestDestroyMutation';

type InterestMeCardProps = {
  animal: Animal,
};

export const InterestMeCard: FC<InterestMeCardProps> = (props) => {
  const {animal} = props;
  const [open, setOpen] = useState(false);
  const {
    mutate: destroyInterest,
    isLoading: isDestroyingInterest,
  } = useInterestDestroyMutation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
  };

  const onDestroy = async () => {
    await destroyInterest(animal);
    await handleClose();
  };

  return (
      <>
        <Card>
          <AnimalCardHeader animal={animal}/>
          <AnimalCardContent animal={animal}/>
          <CardActions>
            <Tooltip title="Remover interesse">
              <IconButton color="error" onClick={handleClickOpen}>
                <NotInterestedIcon/>
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Remover interesse?
          </DialogTitle>
          <DialogContent>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>Cancelar</Button>
            <LoadingButton
                color="error"
                loading={isDestroyingInterest}
                onClick={onDestroy}
            >
              Remover
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </>
  );
};
