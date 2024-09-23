import React from 'react';
import styled from 'styled-components';
import { ReactProps } from 'cmap2-shared';
import { UseFormRegister } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form';
import useInputError from '../../hooks/inputError.hook';
import InputErrorMessage from './inputErrorMessage.component';
import { globalInputStyle } from '../../style/input.style';

interface HiddenInputProps extends ReactProps {
    name: string;
    register: UseFormRegister<any>;
    errors?: FieldErrors;
}

export default function HiddenInput({name, register, errors}: HiddenInputProps) {
    const [hasError, errorMessage] = useInputError(name, errors);

    return (<>
        <HiddenInputStyled type="hidden" {...register(name)} errors={hasError} />
        <InputErrorMessage errorMessage={errorMessage} />
    </>);
};

const HiddenInputStyled = styled.input<{ errors: boolean, width?: string }>`
  ${globalInputStyle};
`;