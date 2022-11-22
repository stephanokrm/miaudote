import Card from '@mui/material/Card';
import {FC} from 'react';
import {Animal, User} from '../../types';
import {AnimalCardContent} from './AnimalCardContent';
import CardActions from '@mui/material/CardActions';
import LoadingButton from '@mui/lab/LoadingButton';
import {AnimalCardHeader} from './AnimalCardHeader';
import {
  useGetInterestsByAnimalQuery,
} from '../../hooks/queries/useGetInterestByAnimalQuery';
import {
  useInterestDestroyMutation,
} from '../../hooks/mutations/useInterestDestroyMutation';
import Link from 'next/link';

type AnimalShowCardProps = {
  animal: Animal,
  user: User | null,
};

export const AnimalShowCard: FC<AnimalShowCardProps> = (props) => {
  const {animal, user} = props;

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
                {interested ? (
                    <LoadingButton
                        fullWidth
                        variant="contained"
                        size="large"
                        color="error"
                        loading={isDestroyingInterest || isLoadingInterested}
                        onClick={destroyInterest}
                        sx={{m: 1}}
                    >
                      Remover interesse
                    </LoadingButton>
                ) : (
                    <Link passHref href={{
                      pathname: '/animal/[animal]/form',
                      query: {animal: animal.id},
                    }}>
                      <LoadingButton
                          color="primary"
                          fullWidth
                          loading={isLoadingInterested}
                          size="large"
                          sx={{m: 1}}
                          variant="contained"
                      >
                        Quero adotar!
                      </LoadingButton>
                    </Link>
                )}
              </CardActions>
          ) : null}
        </Card>
      </>
  );
};
