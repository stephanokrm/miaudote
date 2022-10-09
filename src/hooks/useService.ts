import {useState} from "react";
import {AxiosError} from "axios";
import {FieldValues, UseFormSetError} from "react-hook-form";
import {FieldPath} from "react-hook-form/dist/types/path";

type UseService<FormFields extends FieldValues = FieldValues> = {
    handler: (data: FormFields) => Promise<void>,
    setError?: UseFormSetError<FormFields>,
};

const useService = <FormFields extends FieldValues = FieldValues>({handler, setError}: UseService<FormFields>) => {
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: FormFields) => {
        setMessage(null);
        setLoading(true);

        try {
            await handler(data);
        } catch (e) {
            const error = e as AxiosError<{ message?: string, errors?: { [Property in FieldPath<FormFields>]?: string[] } }>;

            if (error.response?.data.message) {
                setMessage(error.response.data.message);
            }

            if (error.response?.data.errors) {
                (Object.keys(error.response.data.errors) as Array<FieldPath<FormFields>>)
                    .filter(field => {
                        const fieldErrors = error.response?.data?.errors?.[field];

                        return fieldErrors && fieldErrors.length > 0;
                    })
                    .forEach(field => {
                        setError?.(field, {
                            message: error.response?.data?.errors?.[field]?.[0]
                        });
                    });
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        message,
        onSubmit,
    }
};

export default useService;
