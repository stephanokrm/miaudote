import {Controller, FieldValues, ControllerProps} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {TextFieldProps} from '@mui/material/TextField/TextField';
import {AutocompleteProps} from '@mui/material/Autocomplete/Autocomplete';

type ControlledDatePickerProps<Option, FieldValue extends FieldValues,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined> =
    Pick<ControllerProps<FieldValue>, 'name' | 'control'>
    & Omit<AutocompleteProps<Option, Multiple, DisableClearable, FreeSolo>, 'onChange' | 'renderInput'>
    & Pick<TextFieldProps, 'label'>
    & {
  onChange?: (value: Option | null) => void | Promise<void>
};

export function ControlledAutocomplete<Option, FieldValue extends FieldValues>(props: ControlledDatePickerProps<Option, FieldValue>) {
  const {
    name,
    control,
    label,
    onChange,
    ...rest
  } = props;

  return (
      <Controller
          name={name}
          control={control}
          render={({field, fieldState}) => (
              <Autocomplete
                  {...rest}
                  {...field}
                  value={field.value}
                  onChange={async (event, value) => {
                    field.onChange(value);

                    await onChange?.(value);
                  }}
                  renderInput={(params) => (
                      <TextField
                          {...params}
                          fullWidth
                          label={label}
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