import {NextPage} from 'next';
import Head from 'next/head';
import Grid from '@mui/material/Grid';
import {ListHeader} from '../../src/components/ListHeader';
import {
  useGetInterestsQuery,
} from '../../src/hooks/queries/useGetInterestsQuery';
import List from '@mui/material/List';
import {ListItem, ListItemAvatar} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {parsePhoneNumber} from 'libphonenumber-js';
import Tooltip from '@mui/material/Tooltip';
import SentimentDissatisfiedIcon
  from '@mui/icons-material/SentimentDissatisfied';
import Box from '@mui/material/Box';
import FeedIcon from '@mui/icons-material/Feed';
import Badge from '@mui/material/Badge';
import Link from 'next/link';

const Interest: NextPage = () => {
  const {data: interests = [], isLoading, isFetched} = useGetInterestsQuery();

  return (
      <>
        <Head>
          <title>MiAudote - Interessados</title>
        </Head>
        <Grid container spacing={2} sx={{marginY: 2}}>
          <Grid item xs={12} display="flex" alignItems="center">
            <ListHeader label="Interessados" loading={isLoading}/>
          </Grid>
          <Grid item xs={12}>
            {interests?.length > 0 ? (
                <Card>
                  <CardContent sx={{padding: 0}}>
                    <List>
                      {interests.map((interest, index) => (
                          <>
                            <ListItem
                                alignItems="flex-start"
                                sx={{paddingBottom: 3}}
                                secondaryAction={
                                  <>
                                    <Tooltip title="Ver respostas">
                                      <Link passHref href={{
                                        pathname: '/animal/[animal]/user/[user]',
                                        query: {
                                          animal: interest.id,
                                          user: interest.user?.id,
                                        }
                                      }}>
                                      <IconButton
                                          aria-label="Ver respostas"
                                          color="primary"
                                      >
                                        <FeedIcon/>
                                      </IconButton>
                                      </Link>
                                    </Tooltip>
                                    <Tooltip
                                        title={`Conversar com ${interest?.user?.name}`}>
                                      <IconButton aria-label="WhatsApp"
                                                  color="primary"
                                                  href={interest?.user?.phone
                                                      ? `https://wa.me/${parsePhoneNumber(
                                                          interest?.user?.phone,
                                                          'BR').number}`
                                                      : ''} target="_blank">
                                        <WhatsAppIcon/>
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                }>
                              <ListItemAvatar>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'right',
                                    }}
                                    badgeContent={
                                      <Avatar
                                          alt={interest.user?.name}
                                          src={interest.user?.avatar}
                                          sx={{
                                            width: 50,
                                            height: 50,
                                            border: `2px solid white`,
                                          }}
                                      />
                                    }
                                >
                                  <Avatar
                                      alt={interest.name}
                                      src={interest.avatar}
                                      sx={{width: 75, height: 75}}
                                  />
                                </Badge>
                              </ListItemAvatar>
                              <ListItemText
                                  sx={{paddingLeft: 2}}
                                  primary={interest.name}
                                  secondary={
                                    <>
                                      <Typography
                                          sx={{display: 'inline'}}
                                          component="span"
                                          variant="body2"
                                          color="text.primary"
                                      >
                                        {interest.user?.name} quer adotar
                                      </Typography>
                                    </>
                                  }
                              />
                            </ListItem>
                            {index + 1 < interests.length ? (
                                <Divider variant="inset" component="li"/>
                            ) : null}
                          </>
                      ))}
                    </List>
                  </CardContent>
                </Card>
            ) : null}
            {isFetched && interests.length === 0 && (
                <Box textAlign="center">
                  <SentimentDissatisfiedIcon fontSize="large"/>
                  <Typography variant="h5" color="white">
                    Os interesses irão aparecer aqui
                  </Typography>
                </Box>
            )}
          </Grid>
        </Grid>
      </>
  );
};

export default Interest;