import {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useGetAnimalQuery} from '../../../src/hooks/queries/useGetAnimalQuery';
import Grid from '@mui/material/Grid';
import {
  useGetFormByAnimalQuery,
} from '../../../src/hooks/queries/useGetFormByAnimalQuery';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PetsIcon from '@mui/icons-material/Pets';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import {ControlledTextField} from '../../../src/components/ControlledTextField';
import useForm from '../../../src/hooks/useForm';
import Avatar from '@mui/material/Avatar';
import {
  useAnswerCreateSchema,
} from '../../../src/hooks/schemas/useAnswerCreateSchema';
import {
  AnswerCreateFieldValues,
} from '../../../src/types';
import {
  useAnswerStoreMutation,
} from '../../../src/hooks/mutations/useAnswerStoreMutation';

const AnimalForm: NextPage = () => {
  const {query, ...router} = useRouter();
  const {data: animal, isLoading: isLoadingAnimal} = useGetAnimalQuery(
      query.animal as string);
  const {data: form} = useGetFormByAnimalQuery(animal?.id);
  const schema = useAnswerCreateSchema(form?.questions ?? []);
  const {control, setError, handleSubmit} = useForm<AnswerCreateFieldValues>(
      {schema});
  const onSuccess = async () => {
    await router.push(`/animal/${animal?.id}`);
  };
  const {mutate: storeAnswers, message, isLoading: isStoringAnswers} = useAnswerStoreMutation({
    animal,
    setError,
    onSuccess,
  });
  const onSubmit = handleSubmit(
      (data: AnswerCreateFieldValues) => storeAnswers(data));

  return (
      <>
        <Head>
          <title>MiAudote - {isLoadingAnimal
              ? 'Carregando...'
              : animal?.name}</title>
        </Head>
        <Container maxWidth="md" disableGutters>
          <Box paddingY={3}>
            <Grid container justifyContent="center" alignContent="center"
                  spacing={2}>
              <Grid item>
                <Card>
                  <CardContent>
                    <form onSubmit={onSubmit}>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} textAlign="center">
                          <PetsIcon fontSize="large" color="primary"/>
                        </Grid>
                        <Grid item xs={12} display="flex"
                              justifyContent="center">
                          <Avatar alt={animal?.name} src={animal?.avatar}
                                  sx={{width: 200, height: 200}}/>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h4">Formulário de Adoção
                            do {animal?.name}</Typography>
                        </Grid>
                        {message && (
                            <Grid item xs={12}>
                              <Alert severity="error">{message}</Alert>
                            </Grid>
                        )}
                        {form?.questions?.map((question, index) => (
                            <Grid key={question.id} item xs={12}>
                              <ControlledTextField
                                  control={control}
                                  name={question.id}
                                  label={`${index + 1}. ${question.value}`}
                                  multiline
                                  rows={3}
                              />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                          <LoadingButton
                              fullWidth
                              loading={isStoringAnswers }
                              size="large"
                              type="submit"
                              variant="contained"
                          >
                            Enviar
                          </LoadingButton>
                        </Grid>
                      </Grid>
                    </form>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </>
  );
};

export default AnimalForm;
