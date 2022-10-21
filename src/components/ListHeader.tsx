import {FC} from 'react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

type ListHeaderProps = {
  label: string,
  loading: boolean,
}

export const ListHeader: FC<ListHeaderProps> = (props: ListHeaderProps) => {
  const {label, loading} = props;

  return (
      <>
        <Typography variant="h4" color="white" mr={2}>{label}</Typography>
        {loading && <CircularProgress color="secondary" size={25}/>}
      </>
  );
};