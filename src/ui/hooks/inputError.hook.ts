import { FieldErrors } from 'react-hook-form';

export default function useInputError(name?: string, errors?: FieldErrors) {

    function errorMessage(): string | undefined {
        if (errors && name) {
            if (name.indexOf('.') > -1) {
                const keys = name.split('.');
                let value = errors;
                for (let key of keys) {
                    if (value && value.hasOwnProperty(key)) {
                        // @ts-ignore
                        value = value[key];
                    } else {
                        return undefined;
                    }
                }
                return value?.message?.toString();
            } else {
                return errors[name]?.message?.toString();
            }
        }
        return undefined;
    }

    const hasError: boolean = !!errorMessage();

    return [hasError, errorMessage()] as const;
}
