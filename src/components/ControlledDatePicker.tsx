import {Controller, FieldValues, UseControllerProps} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {DatePickerProps} from '@mui/x-date-pickers/DatePicker/DatePicker';

type ControlledDatePickerProps<T extends FieldValues> =
    Omit<DatePickerProps<Date, Date>, 'name' | 'onChange' | 'value' | 'renderInput'>
    & UseControllerProps<T>;

export function ControlledDatePicker<T extends FieldValues>(props: ControlledDatePickerProps<T>) {
  const {
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
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