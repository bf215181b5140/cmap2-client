import React from 'react';
import styled from 'styled-components';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import useInputError from '../../hooks/inputError.hook';
import Icon from '../icon/icon.component';
import InputErrorMessage from './inputErrorMessage.component';
import { globalInputStyle } from '../../style/input.style';
import { ReactProps } from '../../types';

interface CheckboxInputProps extends ReactProps {
  name: string;
  register: UseFormRegister<any>;
  errors?: FieldErrors;
  readOnly?: boolean;
  onChange?: () => void;
}

export default function CheckboxInput({ name, register, errors, readOnly, onChange }: CheckboxInputProps) {
  const [hasError, errorMessage] = useInputError(name, errors);

  function booleanClick(id: string) {
    if (readOnly) return;
    const input = document.getElementById(id);
    if (input) input.click();
    if (onChange) onChange();
  }

  return (<div>
    <CheckboxInputStyled errors={hasError}>
      <input type="checkbox" {...register(name)} id={name + '-CheckboxInput'} readOnly={readOnly} />
      <div onClick={() => booleanClick(name + '-CheckboxInput')} className={readOnly ? 'readOnly' : undefined}>
        <Icon icon="ri-check-fill" />
      </div>
    </CheckboxInputStyled>
    <InputErrorMessage errorMessage={errorMessage} />
  </div>);
};

const CheckboxInputStyled = styled.span<{ errors?: boolean }>`
  input[type=checkbox] {
    display: none;
  }

  div {
    ${globalInputStyle};
    cursor: pointer;
    width: 44px;
    font-size: 35px;
  }

  div i {
    visibility: hidden;
  }

  input[type=checkbox]:checked ~ div i {
    visibility: visible;
  }

  div.readOnly {
    pointer-events: none;
    color: ${props => props.theme.colors.input.textDisabled};
    filter: saturate(0%);
  }
`;
