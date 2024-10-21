import React from 'react';
import styled from 'styled-components';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import useInputError from '../../hooks/inputError.hook';
import InputErrorMessage from './inputErrorMessage.component';
import { globalInputStyle } from './input.style';

interface TextareaInputProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  rows?: number;
  placeholder?: string;
  errors?: FieldErrors;
  readOnly?: boolean;
  width?: string;
}

export default function TextareaInput<T extends FieldValues>({ name, register, rows, placeholder, errors, readOnly, width }: TextareaInputProps<T>) {
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
