import React from 'react';
import styled from 'styled-components';
import { globalInputStyle } from '../input.style';
import { ReactProps } from 'cmap2-shared';
import { UseFormRegister } from 'react-hook-form/dist/types/form';
import InputErrorMessage from '../inputErrorMessage.component';
import useInputError from '../hooks/inputError.hook';
import { FieldErrors } from 'react-hook-form/dist/types/errors';

interface InputProps extends ReactProps {
    type: 'text' | 'password' | 'url';
    name: string;
    register: UseFormRegister<any>;
    placeholder?: string;
    errors?: FieldErrors;
    readOnly?: boolean;
    width?: string;
}

export default function Input({type, name, register, placeholder, errors, readOnly, width}: InputProps) {
    const [hasError, errorMessage] = useInputError(name, errors);

    return (<div>
        <InputStyled type={type} {...register(name)} placeholder={placeholder} errors={hasError} readOnly={readOnly} width={width} />
        <InputErrorMessage errorMessage={errorMessage} />
    </div>);
};

const InputStyled = styled.input<{ errors: boolean, width?: string }>`
  ${globalInputStyle};
`;
