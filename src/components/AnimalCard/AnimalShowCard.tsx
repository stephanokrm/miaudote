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
import {
  useGetInterestsByAnimalQuery,
} from '../../hooks/queries/useGetInterestByAnimalQuery';
import {
  useInterestDestroyMutation,
} from '../../hooks/mutations/useInterestDestroyMutation';

type AnimalShowCardProps = {
  animal: Animal,
  user: User | null,
};

export const AnimalShowCard: FC<AnimalShowCardProps> = (props) => {
  const {animal, user} = props;

  const {
    mutate,
    isLoading,
  } = useAnimalInterestStoreMutation(animal.id);

  const {
    mutate: destroyInterest,
    isLoading: isDestroyingInterest,
  } = useInterestDestroyMutation(animal);

  const {
    data: interested,
    isLoading: isLoadingInterested,
  } = useGetInterestsByAnimalQuery(animal.id);

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
                    color={interested ? 'error' : 'primary'}
                    loading={isLoading || isDestroyingInterest ||
                        isLoadingInterested}
                    onClick={interested ? destroyInterest : mutate}
                    sx={{m: 1}}
                >
                  {interested ? 'Remover interesse' : 'Quero adotar!'}
                </LoadingButton>
              </CardActions>
          ) : null}
        </Card>
      </>
  );
};
