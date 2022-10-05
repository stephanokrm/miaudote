import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import CardActionArea from '@mui/material/CardActionArea'
import CakeIcon from '@mui/icons-material/Cake';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import type {NextPage} from 'next'
import Head from 'next/head'
import useAnimals from "../src/hooks/useAnimals";
import {differenceInMonths, differenceInYears, formatDuration} from 'date-fns'
import {ptBR} from 'date-fns/locale'
import Container from "@mui/material/Container";

const Home: NextPage = () => {
    const {animals, loading} = useAnimals();

    return (
        <>
            <Head>
                <title>MiAudote</title>
            </Head>
            <Container maxWidth="lg">
                <Grid container component="main" spacing={2} justifyContent="center"
                      sx={{marginTop: 4, marginBottom: 4}}>
                    {loading && (
                        <CircularProgress color="secondary"/>
                    )}
                    {!loading && animals.length === 0 && (
                        <Grid item xs={12} textAlign="center">
                            <SentimentDissatisfiedIcon fontSize="large"/>
                            <Typography variant="h4" color="white">Nenhuma doação disponível</Typography>
                        </Grid>
                    )}
                    {animals.map((animal) => {
                        const years = differenceInYears(new Date(), animal.bornAt);
                        const months = differenceInMonths(new Date(), animal.bornAt);
                        return (
                            <Grid item key={animal.name} xs={12} md={6} lg={4} xl={3}>
                                <Card variant="outlined" style={{
                                    position: 'relative',
                                    minHeight: '380px',
                                }}>
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            alt={animal.name}
                                            image={animal.images[0]?.url}
                                        />
                                    </CardActionArea>
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        width: '100%',
                                        background: 'white',
                                        borderRadius: '30px',
                                        boxShadow: '0px -15px 15px 0px rgba(0,0,0,0.1)',
                                    }}>
                                        <CardContent>
                                            <Grid container alignContent="center"
                                                  spacing={1}>
                                                <Grid item xs={12}>
                                                    <Grid container justifyContent="space-between" alignContent="center"
                                                          spacing={1}>
                                                        <Grid item>
                                                            <Typography variant="h5">
                                                                {animal.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary"
                                                                        gutterBottom>
                                                                {animal.city.name} - {animal.city.state.initials}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <IconButton color="primary">
                                                                {true ? <FavoriteIcon/> : <FavoriteBorderOutlinedIcon/>}
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="caption" color="text.secondary" gutterBottom>
                                                        <Box display="flex" alignContent="center" flexWrap="wrap">
                                                            <CakeIcon fontSize="small"/>
                                                            <Box paddingLeft={1}>
                                                                {formatDuration({
                                                                    years,
                                                                    months: years === 0 ? (months === 0 ? 1 : months) : 0,
                                                                }, {
                                                                    locale: ptBR,
                                                                    format: ['years', 'months']
                                                                })}
                                                            </Box>
                                                        </Box>
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="caption" color="text.secondary" gutterBottom>
                                                        <Box display="flex" alignContent="center" flexWrap="wrap">
                                                            {animal.gender === 'MALE' ? <MaleIcon fontSize="small"/> :
                                                                <FemaleIcon fontSize="small"/>}
                                                            <Box paddingLeft={1}>
                                                                {animal.gender === 'MALE' ? 'Macho' : 'Fêmea'}
                                                            </Box>
                                                        </Box>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Box>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </>
    )
}

export default Home
