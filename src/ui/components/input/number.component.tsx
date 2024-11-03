import React from 'react';
import styled from 'styled-components';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import useInputError from '../../hooks/inputError.hook';
import InputErrorMessage from './inputErrorMessage.component';
import { globalInputStyle } from './input.style';

interface NumberInputProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  decimals?: number;
  placeholder?: string;
  errors?: FieldErrors;
  readOnly?: boolean;
  width?: string;
}

export default function NumberInput<T extends FieldValues>({ name, register, decimals = 0, placeholder, errors, readOnly, width }: NumberInputProps<T>) {
  const [hasError, errorMessage] = useInputError(name, errors);

  function setValue(value: string) {
    if (value === undefined) return undefined;
    if (value === null) return null;
    if (value === '') return null;
    if (Number.isNaN(value)) return null;
    if (decimals === 0) return parseInt(value);
    if (decimals >= 0 && decimals <= 100) {
      const factor = Math.pow(10, decimals);
      const number = parseFloat(value);
      return Math.round(number * factor) / factor;
    }
    return null;
  }

  function step() {
    return Math.pow(10, -decimals);
  }

  return (<div style={{ width: width || '100%' }}>
    <NumberInputStyled type={'number'} {...register(name, { setValueAs: setValue })} step={step()} placeholder={placeholder} errors={hasError} readOnly={readOnly} width={'100%'} />
    <InputErrorMessage errorMessage={errorMessage} />
  </div>);
};

const NumberInputStyled = styled.input<{ errors: boolean, width?: string }>`
  ${globalInputStyle};

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
`;
