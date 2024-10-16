import React from 'react';
import styled from 'styled-components';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ReactProps } from '../../types';
import useInputError from '../../hooks/inputError.hook';
import InputErrorMessage from './inputErrorMessage.component';
import { globalInputStyle } from './input.style';

interface NumberInputProps extends ReactProps {
  name: string;
  register: UseFormRegister<any>;
  decimals?: number;
  placeholder?: string;
  errors?: FieldErrors;
  readOnly?: boolean;
  width?: string;
}

export default function NumberInput({ name, register, decimals = 0, placeholder, errors, readOnly, width }: NumberInputProps) {
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

  return (<div>
    <NumberInputStyled type="number" {...register(name, { setValueAs: setValue })} step={step()}
                       placeholder={placeholder} errors={hasError} readOnly={readOnly} width={width} />
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
