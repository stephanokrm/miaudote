import {yupResolver} from "@hookform/resolvers/yup";
import {DeepPartial, FieldValues, useForm as useBaseForm} from "react-hook-form";
import {SchemaOf} from "yup";

type UseForm<Values extends FieldValues = FieldValues> = {
    schema: SchemaOf<Values>,
    defaultValues?: DeepPartial<Values>,
}

const useForm = <Values extends FieldValues = FieldValues>({schema, defaultValues}: UseForm<Values>) => {
    return useBaseForm<Values>({
        resolver: yupResolver(schema),
        shouldUseNativeValidation: false,
        defaultValues,
    });
};

export default useForm;
