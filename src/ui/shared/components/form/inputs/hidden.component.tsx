import React from 'react';
import styled from 'styled-components';
import { globalInputStyle } from '../input.style';
import { ReactProps } from 'cmap2-shared';
import { UseFormRegister } from 'react-hook-form/dist/types/form';
import InputErrorMessage from '../inputErrorMessage.component';
import useInputError from '../hooks/inputError.hook';
import { FieldErrors } from 'react-hook-form/dist/types/errors';

interface HiddenInputProps extends ReactProps {
    name: string;
    // register: UseFormRegister<any>;
    errors?: FieldErrors;
}

export default function HiddenInput({name, errors}: HiddenInputProps) {
    const [hasError, errorMessage] = useInputError(name, errors);

    return (<>
        <HiddenInputStyled type="hidden" errors={hasError} />
        <InputErrorMessage errorMessage={errorMessage} />
    </>);
};

const HiddenInputStyled = styled.input<{ errors: boolean, width?: string }>`
  ${globalInputStyle};
`;
