import {yupResolver} from "@hookform/resolvers/yup";
import {DeepPartial, FieldValues, useForm as useBaseForm} from "react-hook-form";
import {SchemaOf} from "yup";

type UseForm<FormFields extends FieldValues = FieldValues> = {
    schema: SchemaOf<FormFields>,
    defaultValues?: DeepPartial<FormFields>,
}

const useForm = <FormFields extends FieldValues = FieldValues>({schema, defaultValues}: UseForm<FormFields>) => {
    return useBaseForm<FormFields>({
        resolver: yupResolver(schema),
        shouldUseNativeValidation: false,
        defaultValues,
    });
};

export default useForm;
