import React from 'react';
import styled from 'styled-components';
import { UseFormRegister } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form';
import { globalInputStyle } from '../../style/input.style';
import InputErrorMessage from './inputErrorMessage.component';
import useInputError from '../../hooks/inputError.hook';
import { ReactProps } from '../../types';

interface InputProps extends ReactProps {
    type?: 'text' | 'password' | 'url';
    name: string;
    register: UseFormRegister<any>;
    placeholder?: string;
    errors?: FieldErrors;
    readOnly?: boolean;
    width?: string;
}

export default function Input({type = 'text', name, register, placeholder, errors, readOnly, width}: InputProps) {
    const [hasError, errorMessage] = useInputError(name, errors);

    return (<div>
        <InputStyled type={type} {...register(name)} placeholder={placeholder} errors={hasError} readOnly={readOnly} width={width} />
        <InputErrorMessage errorMessage={errorMessage} />
    </div>);
};

const InputStyled = styled.input<{ errors: boolean, width?: string }>`
  ${globalInputStyle};
`;
