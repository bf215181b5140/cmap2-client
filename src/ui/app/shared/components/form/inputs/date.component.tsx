import React from 'react';
import styled from 'styled-components';
import { globalInputStyle } from '../input.style';
import { ReactProps } from 'cmap2-shared';
import { UseFormRegister } from 'react-hook-form/dist/types/form';
import InputErrorMessage from '../inputErrorMessage.component';
import useInputError from '../hooks/inputError.hook';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import { useController } from 'react-hook-form';

interface DateInputProps extends ReactProps {
    type?: 'date' | 'datetime-local'
    name: string;
    register: UseFormRegister<any>;
    control: any;
    placeholder?: string;
    errors?: FieldErrors;
    readOnly?: boolean;
    width?: string;
}

export default function DateInput({type = 'date', name, register, control, placeholder, errors, readOnly, width}: DateInputProps) {

    const [hasError, errorMessage] = useInputError(name, errors);
    const { field } = useController({ name, control });

    function setValue(value: string) {
        console.log(new Date(value))
        field.onChange(new Date(value))
        return new Date(value);
    }

    function setDisplayValue(value: string) {
        console.log('setDisplayValue', value)
        console.log('setDisplayValue', new Date(value).toISOString().slice(0,16))
        return new Date(value).toISOString().slice(0,16);
    }

    function onChangetest(value: string) {
        console.log('onChangetest', value)
    }

    return (<div>
        <InputStyled type={type}
                     onChange={(e) => setValue(e.target.value)} // send value to hook form
                     onBlur={field.onBlur} // notify when input is touched/blur
                     value={new Date(field.value).toISOString().slice(0,16)} // input value
                     name={field.name} // send down the input name
                     ref={field.ref} // send input ref, so we can focus on input when error appear
            errors={hasError} readOnly={readOnly} width={width} />
        {/* <InputStyled type={type} {...register(name, { setValueAs: setValue, valueAsDate: true })} placeholder={placeholder} errors={hasError} readOnly={readOnly} width={width} /> */}
        <InputErrorMessage errorMessage={errorMessage} />
    </div>);
};

const InputStyled = styled.input<{ errors: boolean, width?: string }>`
  ${globalInputStyle};
`;
