import React from 'react';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import useInputError from '../../hooks/inputError.hook';
import InputErrorMessage from './inputErrorMessage.component';
import { SelectInputStyled } from './input.style';
import { KeyValueDTO } from 'cmap2-shared';

interface SelectInputProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  options: KeyValueDTO[];
  errors?: FieldErrors;
  readOnly?: boolean;
  width?: string;
}

export default function SelectInput<T extends FieldValues>({ name, register, options, errors, readOnly, width }: SelectInputProps<T>) {
  const [hasError, errorMessage] = useInputError(name, errors);

  return (<div>
    <SelectInputStyled {...register(name)} errors={hasError} className={readOnly ? 'readOnly' : undefined} width={width}>
      {options && options.map((option) => (<option value={option.key} key={option.key}>{option.value}</option>))}
    </SelectInputStyled>
    <InputErrorMessage errorMessage={errorMessage} />
  </div>);
};
