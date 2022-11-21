import {NextPage} from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import {FormCreateFieldValues} from '../../src/types';
import useForm from '../../src/hooks/useForm';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import PetsIcon from '@mui/icons-material/Pets';
import Species from '../../src/enums/Species';
import {
  useFormCreateSchema,
} from '../../src/hooks/schemas/useFormCreateSchema';
import {ControlledRadioGroup} from '../../src/components/ControlledRadioGroup';
import {
  useFormStoreMutation,
} from '../../src/hooks/mutations/useFormStoreMutation';

const FormCreate: NextPage = () => {
  const schema = useFormCreateSchema();
  const {
    control,
    handleSubmit,
    setError,
  } = useForm<FormCreateFieldValues>({
    schema,
  });
  const {mutate, isLoading, message} = useFormStoreMutation({setError});
  const onSubmit = handleSubmit((data: FormCreateFieldValues) => mutate(data));

  return (
      <>
        <Head>
          <title>MiAudote - Novo Formulário</title>
        </Head>
        <Container maxWidth="md" disableGutters>
          <Grid container justifyContent="center" alignContent="center"
                spacing={2} py={3}>
            <Grid item xs={12}>
              <Card sx={{width: '100%'}}>
                <CardContent>
                  <form onSubmit={onSubmit}>
                    <Grid container spacing={2} justifyContent="center">
                      <Grid item xs={12} textAlign="center">
                        <PetsIcon fontSize="large" color="primary"/>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h4">Novo Formulário</Typography>
                      </Grid>
                      {message && (
                          <Grid item xs={12}>
                            <Alert severity="error">{message}</Alert>
                          </Grid>
                      )}
                      <Grid item xs={12}>
                        <ControlledRadioGroup
                            control={control}
                            name="species"
                            label="Espécie"
                            options={[
                              {label: 'Gato', value: Species.Cat},
                              {label: 'Cachorro', value: Species.Dog},
                            ]}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <LoadingButton
                            fullWidth
                            loading={isLoading}
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                          Continuar
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </>
  );
};

export default FormCreate;
