import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import CardActionArea from '@mui/material/CardActionArea'
import TextField from '@mui/material/TextField'
import CakeIcon from '@mui/icons-material/Cake';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import type {NextPage} from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
    const puppies = [
        {
            name: 'Hermione',
            address: 'Mal. Rondon, Canoas - RS',
            age: '2 anos',
            gender: 'Fêmea',
            image: 'https://play-lh.googleusercontent.com/O8mvDQlw4AwmGfUrh4lviZD_PwwhRHz2etA25F77SbXrm3qEHOt2826aNkKar4D0yw=w240-h480-rw',
            favorite: true,
        },
        {
            name: 'Hary',
            address: 'Mal. Rondon, Canoas - RS',
            age: '2 meses',
            gender: 'Macho',
            image: 'https://thumbs.dreamstime.com/b/cute-cat-portrait-square-photo-beautiful-white-closeup-105311158.jpg',
            favorite: false,
        }
    ];

    return (
        <>
            <Head>
                <title>MiAudote</title>
            </Head>
            <Grid container component="main" spacing={2} justifyContent="center">
                {puppies.map((puppie) => (
                    <Grid item key={puppie.name}>
                        <Card sx={{minWidth: 275}} variant="outlined" style={{
                            position: 'relative',
                            height: '335px',
                            width: '250px'
                        }}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    alt="green iguana"
                                    image={puppie.image}
                                />
                            </CardActionArea>
                            <Box sx={{
                                position: 'absolute',
                                top: '200px',
                                width: '100%',
                                background: 'white',
                                borderRadius: '30px',
                                boxShadow: '0px -15px 15px 0px rgba(0,0,0,0.1)',
                            }}>
                                <CardContent>
                                    <Grid container justifyContent="space-between" alignContent="center"
                                          spacing={1}>
                                        <Grid item>
                                            <Typography variant="h5">
                                                {puppie.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                                {puppie.address}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <IconButton color="primary">
                                                {puppie.favorite ? <FavoriteIcon/> : <FavoriteBorderOutlinedIcon/>}
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                                <Box display="flex" alignContent="center" flexWrap="wrap">
                                                    <CakeIcon fontSize="small"/>
                                                    <Box paddingLeft={1}>{puppie.age}</Box>
                                                </Box>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                                <Box display="flex" alignContent="center" flexWrap="wrap">
                                                    {puppie.gender === 'Macho' ? <MaleIcon fontSize="small"/> :
                                                        <FemaleIcon fontSize="small"/>}
                                                    <Box paddingLeft={1}>{puppie.gender}</Box>
                                                </Box>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default Home
