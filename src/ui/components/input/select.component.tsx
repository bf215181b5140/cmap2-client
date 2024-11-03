import React, { ChangeEvent } from 'react';
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
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectInput<T extends FieldValues>({ name, register, options, errors, readOnly, width, onChange }: SelectInputProps<T>) {

  const [hasError, errorMessage] = useInputError(name, errors);

  return (<div style={{ width: width || 'auto' }}>
    <SelectInputStyled {...register(name, { onChange: event => onChange ? onChange(event) : undefined})} errors={hasError} className={readOnly ? 'readOnly' : undefined} width={width || 'auto'}>
      {options && options.map((option) => (<option value={option.key} key={option.key}>{option.value}</option>))}
    </SelectInputStyled>
    <InputErrorMessage errorMessage={errorMessage} />
  </div>);
};
