import React from 'react';
import styled from 'styled-components';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { globalInputStyle } from './input.style';
import InputErrorMessage from './inputErrorMessage.component';
import useInputError from '../../hooks/inputError.hook';

interface InputProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  type?: 'text' | 'password' | 'url';
  placeholder?: string;
  errors?: FieldErrors;
  readOnly?: boolean;
  width?: string;
}

export default function Input<T extends FieldValues>({ type = 'text', name, register, placeholder, errors, readOnly, width }: InputProps<T>) {
  const [hasError, errorMessage] = useInputError(name, errors);

  return (<div style={{ width: width || '100%' }}>
    <InputStyled type={type} {...register(name)} placeholder={placeholder} errors={hasError} readOnly={readOnly} width={'100%'} />
    <InputErrorMessage errorMessage={errorMessage} />
  </div>);
};

const InputStyled = styled.input<{ errors: boolean, width?: string }>`
  ${globalInputStyle};
`;
