import {NextPage} from "next";
import Head from "next/head";
import {useRouter} from 'next/router';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PetsIcon from "@mui/icons-material/Pets";
import CircularProgress from "@mui/material/CircularProgress";
import {useGetAnimalQuery} from '../../../src/hooks/queries/useGetAnimalQuery';
import {AnimalEditForm} from '../../../src/components/AnimalEditForm';

const AnimalEdit: NextPage = () => {
    const {query} = useRouter();
    const {data: animal, isLoading: isLoadingAnimal} = useGetAnimalQuery(query.animal as string);

    return (
        <>
            <Head>
                <title>MiAudote - {isLoadingAnimal ? 'Carregando...' : animal?.name}</title>
            </Head>
            <Container maxWidth="sm">
                <Box paddingY={2} width="100%">
                    <Card sx={{width: '100%'}}>
                        <CardContent>
                            <Box display="flex" paddingY={2} justifyContent="center" textAlign="center">
                                <PetsIcon fontSize="large" color="primary"/>
                            </Box>
                            {isLoadingAnimal ? (
                                <Box display="flex" paddingY={2} justifyContent="center">
                                    <CircularProgress/>
                                </Box>
                            ) : null}
                            {animal ? <AnimalEditForm animal={animal}/> : null}
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </>
    );
};

export default AnimalEdit;
