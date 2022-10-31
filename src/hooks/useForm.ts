import {yupResolver} from '@hookform/resolvers/yup';
import {
  FieldValues,
  UseFormProps,
  useForm as useBaseForm,
} from 'react-hook-form';
import {SchemaOf} from 'yup';

type UseForm<FieldValue extends FieldValues = FieldValues> =
    Pick<UseFormProps<FieldValue>, 'defaultValues'>
    & {
  schema: SchemaOf<FieldValue, File>
}

const useForm = <FieldValue extends FieldValues = FieldValues>({
  schema,
  defaultValues,
}: UseForm<FieldValue>) => {
  return useBaseForm<FieldValue>({
    resolver: yupResolver(schema),
    shouldUseNativeValidation: false,
    defaultValues,
  });
};

export default useForm;
