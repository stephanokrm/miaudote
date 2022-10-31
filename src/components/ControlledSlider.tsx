import {ReactNode} from 'react';
import {
  Controller,
  ControllerProps,
  FieldValues,
} from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import Slider from '@mui/material/Slider';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import {
  SliderUnstyledOwnProps,
} from '@mui/base/SliderUnstyled/SliderUnstyled.types';

type ControlledSliderProps<FieldValue extends FieldValues> =
    Omit<SliderUnstyledOwnProps, 'name'>
    & Pick<ControllerProps<FieldValue>, 'name' | 'control'>
    & {
  label: ReactNode,
  helperText?: ReactNode,
};

export function ControlledSlider<FieldValue extends FieldValues>(props: ControlledSliderProps<FieldValue>) {
  const {
    name,
    control,
    label,
    helperText,
    ...rest
  } = props;

  return (
      <>
        <Box>
          <FormLabel>{label}</FormLabel>
          {helperText ? (
              <FormHelperText sx={{display: 'flex'}}>
                {helperText}
              </FormHelperText>
          ) : null}
        </Box>
        <Box>
          <Stack spacing={2} direction="row" alignItems="center">
            <ThumbDownOffAltIcon/>
            <Controller
                name={name}
                control={control}
                render={({field}) => (
                    <Slider {...field}{...rest} />
                )}
            />
            <ThumbUpOffAltIcon/>
          </Stack>
        </Box>
      </>
  );
}