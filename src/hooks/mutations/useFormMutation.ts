import {useMutation} from "react-query";
import {AxiosError} from "axios";
import {UseFormSetError} from "react-hook-form";
import {FieldValues} from "react-hook-form/dist/types/fields";
import {useState} from "react";
import {UseMutationOptions, UseMutationResult} from "react-query/types/react/types";
import {MutationFunction} from "react-query/types/core/types";
import {FieldPath} from "react-hook-form/dist/types/path";

type ServiceError<TFieldValues extends FieldValues> = AxiosError<{ message?: string, errors?: { [Property in FieldPath<TFieldValues>]?: string[] } }>

type Options<TData, TError, TVariables extends FieldValues, TContext> = {
    setError?: UseFormSetError<TVariables>,
} & Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>;

type UseFormMutationResult<TData, TError, TVariables, TContext> = {
    message?: string,
} & UseMutationResult<TData, TError, TVariables, TContext>;

export const useFormMutation = <TData, TVariables extends FieldValues, TContext = unknown>(
    mutationFn: MutationFunction<TData, TVariables>, options?: Options<TData, ServiceError<TVariables>, TVariables, TContext>
): UseFormMutationResult<TData, ServiceError<TVariables>, TVariables, TContext> => {
    const [message, setMessage] = useState<string>();

    const mutation = useMutation<TData, ServiceError<TVariables>, TVariables, TContext>(mutationFn, {
        ...options,
        onError: async (error: ServiceError<TVariables>, variables: TVariables, context: TContext | undefined) => {
            if (error.response?.data.message) {
                setMessage(error.response.data.message);
            }

            if (error.response?.data.errors) {
                (Object.keys(error.response.data.errors) as Array<FieldPath<TVariables>>)
                    .filter(field => {
                        const fieldErrors = error.response?.data?.errors?.[field];

                        return fieldErrors && fieldErrors.length > 0;
                    })
                    .forEach(field => {
                        options?.setError?.(field, {
                            message: error.response?.data?.errors?.[field]?.[0]
                        });
                    });
            }

            options?.onError?.(error, variables, context);
        },
    })

    return {
        ...mutation,
        message,
    }
};
