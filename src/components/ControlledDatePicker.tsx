import {
  Controller,
  ControllerProps,
  FieldValues,
} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {DatePickerProps} from '@mui/x-date-pickers/DatePicker/DatePicker';

type ControlledDatePickerProps<FieldValue extends FieldValues> =
    Omit<DatePickerProps<Date, Date>, 'name' | 'onChange' | 'value' | 'renderInput'>
    & Pick<ControllerProps<FieldValue>, 'name' | 'control'>;

export function ControlledDatePicker<FieldValue extends FieldValues>(props: ControlledDatePickerProps<FieldValue>) {
  const {
    name,
    control,
    ...rest
  } = props;

  return (
      <Controller
          name={name}
          control={control}
          render={({field, fieldState}) => (
              <DatePicker
                  {...rest}
                  {...field}
                  onChange={(event) => {
                    if (event) field.onChange(event);
                  }}
                  renderInput={(params) => (
                      <TextField
                          {...params}
                          fullWidth
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          variant="filled"
                      />
                  )}
              />
          )}
      />
  );
}