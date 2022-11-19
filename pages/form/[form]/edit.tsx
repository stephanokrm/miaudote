import {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PetsIcon from '@mui/icons-material/Pets';
import {useGetFormQuery} from '../../../src/hooks/queries/useGetFormQuery';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Species from '../../../src/enums/Species';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import useForm from '../../../src/hooks/useForm';
import {
  QuestionCreateFieldValues,
} from '../../../src/types';
import {
  useQuestionCreateSchema,
} from '../../../src/hooks/schemas/useQuestionCreateSchema';
import {
  useQuestionStoreMutation,
} from '../../../src/hooks/mutations/useQuestionStoreMutation';

const FormEdit: NextPage = () => {
  const {query} = useRouter();
  const {data: form, isLoading: isLoadingForm} = useGetFormQuery(
      query.form as string,
  );
  const schema = useQuestionCreateSchema();
  const {
    handleSubmit,
    setError,
  } = useForm<QuestionCreateFieldValues>({
    schema,
  });
  const {mutate, message} = useQuestionStoreMutation({form, setError});
  const onSubmit = handleSubmit(
      (data: QuestionCreateFieldValues) => mutate(data));

  const title = form
      ? form.species === Species.Cat
          ? 'Gatos'
          : 'Cachorros'
      : 'Carregando...';

  return (
      <>
        <Head>
          <title>MiAudote - {isLoadingForm
              ? 'Carregando...'
              : form?.species}</title>
        </Head>
        <Container maxWidth="md" disableGutters>
          <Box display="flex" paddingY={3} width="100%">
            <Card sx={{width: '100%'}}>
              <CardContent>
                <form onSubmit={() => {}}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} textAlign="center">
                      <PetsIcon fontSize="large" color="primary"/>
                    </Grid>
                    {isLoadingForm ? (
                        <Box display="flex" paddingY={2}
                             justifyContent="center">
                          <CircularProgress/>
                        </Box>
                    ) : null}
                    {form?.species ? (
                        <Grid item xs={12}>
                          <Typography variant="h3">Formulário
                            de {title}</Typography>
                        </Grid>
                    ) : null}
                    {message && (
                        <Grid item xs={12}>
                          <Alert severity="error">{message}</Alert>
                        </Grid>
                    )}
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </>
  );
};

export default FormEdit;
