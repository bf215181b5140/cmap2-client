import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import useInputError from '../../hooks/inputError.hook';
import InputErrorMessage from './inputErrorMessage.component';
import { SelectInputStyled } from '../../style/input.style';
import { ReactProps } from '../../types';
import { KeyValueDTO } from 'cmap2-shared';

interface SelectInputProps extends ReactProps {
  name: string;
  register: UseFormRegister<any>;
  options: KeyValueDTO[];
  errors?: FieldErrors;
  readOnly?: boolean;
  width?: string;
}

export default function SelectInput({ name, register, options, errors, readOnly, width }: SelectInputProps) {
  const [hasError, errorMessage] = useInputError(name, errors);

  return (<div>
    <SelectInputStyled {...register(name)} errors={hasError} className={readOnly ? 'readOnly' : undefined} width={width}>
      {options && options.map((option) => (<option value={option.key} key={option.key}>{option.value}</option>))}
    </SelectInputStyled>
    <InputErrorMessage errorMessage={errorMessage} />
  </div>);
};
