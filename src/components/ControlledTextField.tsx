import {ChangeEvent} from 'react';
import {Controller, FieldValues, UseControllerProps} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import {TextFieldProps} from '@mui/material/TextField/TextField';

type ControlledTextFieldProps<T extends FieldValues> =
    Omit<TextFieldProps, 'name'>
    & UseControllerProps<T>
    & {
  transform?: (value: string) => any,
};

export function ControlledTextField<T extends FieldValues>(props: ControlledTextFieldProps<T>) {
  const {
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    transform = (value) => value,
    ...rest
  } = props;

  return (
      <Controller
          name={name}
          rules={rules}
          control={control}
          shouldUnregister={shouldUnregister}
          defaultValue={defaultValue}
          render={({field, fieldState}) => (
              <TextField
                  {...field}
                  {...rest}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  variant="filled"
                  onChange={(changeEvent: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                    field.onChange({
                      ...changeEvent,
                      target: {
                        ...changeEvent.target,
                        value: transform(changeEvent.target.value),
                      },
                    });
                  }}
              />
          )}
      />
  );
}