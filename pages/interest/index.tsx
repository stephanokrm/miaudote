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

const Interest: NextPage = () => {
  const {data: interests = [], isLoading} = useGetInterestsQuery();

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
            <Card>
              <CardContent sx={{padding: 0}}>
                <List>
                  {interests?.map((interest) => (
                      <>
                        <ListItem alignItems="flex-start" secondaryAction={
                          <Tooltip title={`Conversar com ${interest?.user?.name}`}>
                            <IconButton aria-label="WhatsApp" color="primary"
                                        href={interest?.user?.phone
                                            ? `https://wa.me/${parsePhoneNumber(
                                                interest?.user?.phone,
                                                'BR').number}`
                                            : ''} target="_blank">
                              <WhatsAppIcon/>
                            </IconButton>
                          </Tooltip>
                        }>
                          <ListItemAvatar>
                            <Avatar alt={interest.name} src={interest.avatar}/>
                          </ListItemAvatar>
                          <ListItemText
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
                        <Divider variant="inset" component="li"/>
                      </>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
  );
};

export default Interest;