import {FC} from 'react';
import {useTheme} from '@mui/material';
import {
  differenceInMonths,
  differenceInYears,
  formatDuration,
  parseISO,
} from 'date-fns';
import Link from 'next/link';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PlaceIcon from '@mui/icons-material/Place';
import CakeIcon from '@mui/icons-material/Cake';
import {ptBR} from 'date-fns/locale';
import Gender from '../../enums/Gender';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import {getAnimalGenderLabel} from '../../utils';
import HealingIcon from '@mui/icons-material/Healing';
import {Animal} from '../../types';

type AnimalCardContentProps = {
  animal: Animal;
}

const today = new Date();

export const AnimalCardContent: FC<AnimalCardContentProps> = (props) => {
  const {
    animal,
  } = props;
  const theme = useTheme();
  const bornAt = parseISO(animal.bornAtISO);
  const years = differenceInYears(today, bornAt);
  const months = differenceInMonths(today, bornAt);

  return (
      <Link
          href={{
            pathname: '/animal/[animal]',
            query: {animal: animal.id},
          }}
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
  );
};