import React from 'react';
import styled from 'styled-components';
import { UseFormRegister } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form';
import useInputError from '../../hooks/inputError.hook';
import InputErrorMessage from './inputErrorMessage.component';
import { globalInputStyle } from '../../style/input.style';

interface TextareaInputProps {
    name: string;
    register: UseFormRegister<any>;
    rows?: number;
    placeholder?: string;
    errors?: FieldErrors;
    readOnly?: boolean;
    width?: string;
}

export default function TextareaInput({ name, register, rows, placeholder, errors, readOnly, width }: TextareaInputProps) {
    const [hasError, errorMessage] = useInputError(name, errors);

    return (<div>
        <TextareaInputStyled {...register(name)} rows={rows || 3} placeholder={placeholder} errors={hasError} readOnly={readOnly} width={width} />
        <InputErrorMessage errorMessage={errorMessage} />
    </div>);
};

const TextareaInputStyled = styled.textarea<{ errors: boolean, width?: string }>`
    ${globalInputStyle};
    padding: 10px;
    height: auto;
`;
