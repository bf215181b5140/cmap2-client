import React from 'react';
import { ReactProps } from 'cmap2-shared';
import ButtonInput from './button.component';

interface SubmitInputProps extends ReactProps {
    text?: string;
    disabled?: boolean;
}

export default function SubmitInput({text, disabled}: SubmitInputProps) {

    return (<ButtonInput type={'submit'} text={text ? text : 'Save'} disabled={disabled} />);
};
