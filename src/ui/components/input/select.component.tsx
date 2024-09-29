import React from 'react';
import { CmapSelectOption, ReactProps } from 'cmap2-shared';
import { UseFormRegister } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form';
import useInputError from '../../hooks/inputError.hook';
import InputErrorMessage from './inputErrorMessage.component';
import { SelectInputStyled } from '../../style/input.style';

interface SelectInputProps extends ReactProps {
    name: string;
    register: UseFormRegister<any>;
    options: CmapSelectOption[];
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
