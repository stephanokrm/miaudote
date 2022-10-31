import {ReactNode} from 'react';
import {
  Controller,
  ControllerProps,
  FieldValues,
} from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormHelperText from '@mui/material/FormHelperText';
import {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import {RadioGroupProps} from '@mui/material/RadioGroup/RadioGroup';

type ControlledRadioGroupProps<FieldValue extends FieldValues> =
    Omit<RadioGroupProps, 'name'>
    & Pick<ControllerProps<FieldValue>, 'name' | 'control'>
    & {
  label: ReactNode,
  options: Pick<FormControlLabelProps, 'label' | 'value'>[]
};

export function ControlledRadioGroup<FieldValue extends FieldValues>(props: ControlledRadioGroupProps<FieldValue>) {
  const {
    name,
    control,
    label,
    options,
    ...rest
  } = props;

  return (
      <FormControl>
        <FormLabel id={name}>{label}</FormLabel>
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => (
                <RadioGroup
                    {...field}
                    {...rest}
                    aria-labelledby={name}
                >
                  {options.map((option, index) => (
                      <FormControlLabel
                          key={typeof option.value === 'string'
                              ? option.value
                              : index}
                          value={option.value}
                          control={<Radio/>}
                          label={option.label}
                      />
                  ))}
                  {fieldState.error ? (
                      <FormHelperText error>
                        {fieldState.error.message}
                      </FormHelperText>
                  ) : null}
                </RadioGroup>
            )}
        />
      </FormControl>
  );
}