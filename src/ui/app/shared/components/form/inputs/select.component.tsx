import React from 'react';
import styled from 'styled-components';
import { globalInputStyle } from '../input.style';
import { FieldOption, ReactProps } from 'cmap2-shared';
import { UseFormRegister } from 'react-hook-form/dist/types/form';
import InputErrorMessage from '../inputErrorMessage.component';
import useInputError from '../hooks/inputError.hook';
import { FieldErrors } from 'react-hook-form/dist/types/errors';

interface SelectInputProps extends ReactProps {
    name: string;
    register: UseFormRegister<any>;
    options: FieldOption[];
    errors?: FieldErrors;
    readOnly?: boolean;
    width?: string;
}

export default function SelectInput({name, register, options, errors, readOnly, width}: SelectInputProps) {
    const [hasError, errorMessage] = useInputError(name, errors);

    return (<div>
        <SelectInputStyled {...register(name)} errors={hasError} className={readOnly ? 'readOnly' : undefined} width={width}>
            {options && options.map((option) => (<option value={option.key} key={option.key}>{option.value}</option>))}
        </SelectInputStyled>
        <InputErrorMessage errorMessage={errorMessage} />
    </div>);
};

export const SelectInputStyled = styled.select<{ errors?: boolean, width?: string }>`
  ${globalInputStyle};
  cursor: pointer;

  &.readOnly {
    pointer-events: none;
    color: ${props => props.theme.colors.input.textDisabled};
    filter: saturate(0%);
  }
`;
