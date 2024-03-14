import React from 'react';
import styled from 'styled-components';
import { globalInputStyle } from '../input.style';
import { ReactProps } from 'cmap2-shared';
import { UseFormRegister } from 'react-hook-form/dist/types/form';
import InputErrorMessage from '../inputErrorMessage.component';
import useInputError from '../hooks/inputError.hook';
import { FieldErrors } from 'react-hook-form/dist/types/errors';

interface TextareaInputProps extends ReactProps {
    name: string;
    register: UseFormRegister<any>;
    rows?: number;
    placeholder?: string;
    errors?: FieldErrors;
    readOnly?: boolean;
    width?: string;
}

export default function TextareaInput({name, register, rows, placeholder, errors, readOnly, width}: TextareaInputProps) {
    const [hasError, errorMessage] = useInputError(name, errors);

    return (<div>
        <TextareaInputStyled {...register(name)} rows={rows} placeholder={placeholder} errors={hasError} readOnly={readOnly} width={width} />
        <InputErrorMessage errorMessage={errorMessage} />
    </div>);
};

const TextareaInputStyled = styled.textarea<{ errors: boolean, width?: string }>`
  ${globalInputStyle};
  padding: 10px;
  height: 120px;
`;
