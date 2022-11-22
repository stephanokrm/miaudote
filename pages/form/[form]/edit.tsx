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
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {useState} from 'react';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import {ControlledTextField} from '../../../src/components/ControlledTextField';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  useGetQuestionsByFormQuery,
} from '../../../src/hooks/queries/useGetQuestionsByFormQuery';
import {
  useQuestionDestroyMutation,
} from '../../../src/hooks/mutations/useQuestionDestroyMutation';
import {getSpecies} from '../../../src/utils';

const FormEdit: NextPage = () => {
  const {query} = useRouter();
  const [addingQuestion, setAddingQuestion] = useState(false);
  const {
    data: form,
    isLoading: isLoadingForm,
  } = useGetFormQuery(query.form as string);
  const schema = useQuestionCreateSchema();
  const {
    handleSubmit,
    setError,
    control,
    setValue,
  } = useForm<QuestionCreateFieldValues>({
    schema,
  });
  const {
    mutate: storeQuestion,
    message,
    isLoading: isStoringQuestion,
  } = useQuestionStoreMutation({
    form,
    setError,
    onSuccess: () => {
      setAddingQuestion(false);
      setValue('value', '');
    },
  });
  const {
    mutate: destroyQuestion,
  } = useQuestionDestroyMutation(form);
  const {
    data: questions,
    isLoading: isLoadingQuestions,
  } = useGetQuestionsByFormQuery(form);

  const onSubmit = handleSubmit(
      (data: QuestionCreateFieldValues) => storeQuestion(data),
  );

  const isLoading = isLoadingForm || isLoadingQuestions;

  return (
      <>
        <Head>
          <title>
            MiAudote - {form
              ? `${getSpecies(form.species)}s`
              : 'Carregando...'}
          </title>
        </Head>
        <Container maxWidth="md" disableGutters>
          <Box display="flex" paddingY={3} width="100%">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{width: '100%'}}>
                  <CardContent>
                    <form onSubmit={() => {}}>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} textAlign="center">
                          <PetsIcon fontSize="large" color="primary"/>
                        </Grid>
                        {isLoading ? (
                            <Grid
                                item
                                xs={12}
                                display="flex"
                                justifyContent="center"
                            >
                              <CircularProgress/>
                            </Grid>
                        ) : form?.species ? (
                            <Grid item xs={12}>
                              <Typography variant="h4">
                                Formulário de {getSpecies(form.species)}s
                              </Typography>
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
              </Grid>
              {questions?.map((question, index) => (
                  <Grid key={question.id} item display="flex" xs={12}>
                    <Card sx={{width: '100%'}}>
                      <form onSubmit={onSubmit}>
                        <CardContent>
                          <Typography>{index + 1}. {question.value}</Typography>
                        </CardContent>
                        <CardActions
                            sx={{display: 'flex', justifyContent: 'end'}}
                        >
                          <IconButton
                              aria-label="delete"
                              onClick={() => destroyQuestion(question)}
                          >
                            <DeleteIcon/>
                          </IconButton>
                        </CardActions>
                      </form>
                    </Card>
                  </Grid>
              ))}
              {addingQuestion ? (
                  <Grid item display="flex" xs={12}>
                    <Card sx={{width: '100%'}}>
                      <form onSubmit={onSubmit}>
                        <CardContent>
                          <ControlledTextField
                              name="value"
                              control={control}
                              label="Pergunta"
                          />
                        </CardContent>
                        <CardActions
                            sx={{display: 'flex', justifyContent: 'end'}}
                        >
                          <IconButton
                              aria-label="delete"
                              onClick={() => {
                                setAddingQuestion(false);
                                setValue('value', '');
                              }}
                          >
                            <DeleteIcon/>
                          </IconButton>
                          <LoadingButton type="submit"
                                         loading={isStoringQuestion}
                                         disabled={isStoringQuestion}>
                            Salvar
                          </LoadingButton>
                        </CardActions>
                      </form>
                    </Card>
                  </Grid>
              ) : null}
              {!addingQuestion ? (
                  <Grid item display="flex" xs={12} justifyContent="end">
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon/>}
                        onClick={() => setAddingQuestion(true)}
                    >
                      Adicionar Pergunta
                    </Button>
                  </Grid>
              ) : null}
            </Grid>
          </Box>
        </Container>
      </>
  );
};

export default FormEdit;
