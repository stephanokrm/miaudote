import Card from '@mui/material/Card';
import {FC} from 'react';
import {Animal, User} from '../../types';
import {AnimalCardContent} from './AnimalCardContent';
import CardActions from '@mui/material/CardActions';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  useAnimalInterestStoreMutation,
} from '../../hooks/mutations/useAnimalInterestStoreMutation';
import {AnimalCardHeader} from './AnimalCardHeader';

type AnimalShowCardProps = {
  animal: Animal,
  user: User | null,
};

export const AnimalShowCard: FC<AnimalShowCardProps> = (props) => {
  const {animal, user} = props;

  const {
    mutate,
    isLoading,
    isSuccess,
  } = useAnimalInterestStoreMutation(animal.id);

  return (
      <>
        <Card>
          <AnimalCardHeader animal={animal}/>
          <AnimalCardContent animal={animal}/>
          {user ? (
              <CardActions>
                <LoadingButton
                    fullWidth
                    variant="contained"
                    size="large"
                    loading={isLoading}
                    disabled={isSuccess}
                    onClick={mutate}
                    sx={{m: 1}}
                >
                  {isSuccess ? 'Interesse salvo!' : 'Quero adotar!'}
                </LoadingButton>
              </CardActions>
          ) : null}
        </Card>
      </>
  );
};
