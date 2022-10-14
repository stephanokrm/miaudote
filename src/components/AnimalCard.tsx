import {differenceInMonths, differenceInYears, formatDuration, parseISO} from "date-fns";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CakeIcon from "@mui/icons-material/Cake";
import {ptBR} from "date-fns/locale";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import {Animal} from "../types";
import {useState} from "react";
import Link from 'next/link';
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import {useAnimalDestroyMutation} from "../hooks/mutations/useAnimalDestroyMutation";

type AnimalCardProps = {
    animal: Animal,
    editable?: boolean,
};

const today = new Date();

const AnimalCard = (props: AnimalCardProps) => {
    const {animal, editable = false} = props;
    const bornAt = parseISO(animal.bornAtISO);
    const years = differenceInYears(today, bornAt);
    const months = differenceInMonths(today, bornAt);
    const [open, setOpen] = useState(false);
    const {mutate: destroyAnimal, isLoading: isDestroyingAnimal, message} = useAnimalDestroyMutation();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false);
    };

    const onDestroy = async () => {
        await destroyAnimal(animal);
        await handleClose();
    };

    return (
        <>
            <Card variant="outlined" style={{
                position: "relative",
                minHeight: "380px",
            }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        alt={animal.name}
                        image={animal.avatar}
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
                                    {message && (
                                        <Grid item xs={12}>
                                            <Alert severity="error">{message}</Alert>
                                        </Grid>
                                    )}
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
                                            <>
                                                <IconButton color="error" onClick={handleClickOpen}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                                <Link href={{
                                                    pathname: '/animal/[animal]/edit',
                                                    query: {animal: animal.id}
                                                }} passHref>
                                                    <IconButton color="primary">
                                                        <EditIcon/>
                                                    </IconButton>
                                                </Link>
                                            </>
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
            </Card>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Desativar doação {animal.gender === 'MALE' ? 'do' : 'da'} {animal.name}?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Ao desativar a doação, a mesma não será mais exibida na plataforma. Você pode restaurá-la
                        depois.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>Cancelar</Button>
                    <LoadingButton color="error" loading={isDestroyingAnimal} onClick={onDestroy}>
                        Desativar
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AnimalCard;
