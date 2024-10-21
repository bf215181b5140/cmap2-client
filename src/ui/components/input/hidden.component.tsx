import React from 'react';
import styled from 'styled-components';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import useInputError from '../../hooks/inputError.hook';
import InputErrorMessage from './inputErrorMessage.component';
import { globalInputStyle } from './input.style';

interface HiddenInputProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors;
}

export default function HiddenInput<T extends FieldValues>({ name, register, errors }: HiddenInputProps<T>) {
  const [hasError, errorMessage] = useInputError(name, errors);

  return (<>
    <HiddenInputStyled type="hidden" {...register(name)} errors={hasError} />
    <InputErrorMessage errorMessage={errorMessage} />
  </>);
};

const HiddenInputStyled = styled.input<{ errors: boolean, width?: string }>`
  ${globalInputStyle};
`;
