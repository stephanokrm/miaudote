import {differenceInMonths, differenceInYears, formatDuration} from "date-fns";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import EditIcon from '@mui/icons-material/Edit';
import CakeIcon from "@mui/icons-material/Cake";
import {ptBR} from "date-fns/locale";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import {Animal} from "../types";

type AnimalCardProps = {
    animal: Animal,
    editable?: boolean,
};

const AnimalCard = (props: AnimalCardProps) => {
    const {animal, editable = false} = props;
    const years = differenceInYears(new Date(), animal.bornAt);
    const months = differenceInMonths(new Date(), animal.bornAt);

    return <Card variant="outlined" style={{
        position: "relative",
        minHeight: "380px",
    }}>
        <CardActionArea>
            <CardMedia
                component="img"
                alt={animal.name}
                image={animal.images[0]?.url}
            />
        </CardActionArea>
        <Box sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            background: "white",
            borderRadius: "30px",
            boxShadow: "0px -15px 15px 0px rgba(0,0,0,0.1)",
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
                                {editable ? (
                                    <IconButton color="primary">
                                        <EditIcon/>
                                    </IconButton>
                                ) : (
                                    <IconButton color="primary">
                                        {true ? <FavoriteIcon/> : <FavoriteBorderOutlinedIcon/>}
                                    </IconButton>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                            <Box display="flex" alignContent="center" flexWrap="wrap">
                                <CakeIcon fontSize="small"/>
                                <Box paddingLeft={1}>
                                    {formatDuration({
                                        years: years,
                                        months: years === 0 ? (months === 0 ? 1 : months) : 0,
                                    }, {
                                        locale: ptBR,
                                        format: ["years", "months"]
                                    })}
                                </Box>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                            <Box display="flex" alignContent="center" flexWrap="wrap">
                                {animal.gender === "MALE" ? <MaleIcon fontSize="small"/> :
                                    <FemaleIcon fontSize="small"/>}
                                <Box paddingLeft={1}>
                                    {animal.gender === "MALE" ? "Macho" : "Fêmea"}
                                </Box>
                            </Box>
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Box>
    </Card>;
}

export default AnimalCard;
