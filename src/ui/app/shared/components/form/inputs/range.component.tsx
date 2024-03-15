import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { globalInputStyle } from '../input.style';
import { ReactProps } from 'cmap2-shared';
import { UseFormWatch } from 'react-hook-form';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form/dist/types/form';
import InputErrorMessage from '../inputErrorMessage.component';
import useInputError from '../hooks/inputError.hook';
import { FieldErrors } from 'react-hook-form/dist/types/errors';

interface RangeInputProps extends ReactProps {
    name: string;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    watch: UseFormWatch<any>;
    errors?: FieldErrors;
    readOnly?: boolean;
    width?: string;
}

export default function RangeInput({name, register, setValue, watch, errors, readOnly, width}: RangeInputProps) {
    const sliderValue = watch(name);
    const inputRef = useRef<any>(null);
    const [dragging, setDragging] = useState(false);
    const [hasError, errorMessage] = useInputError(name, errors);

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', calculateInputRange);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', calculateInputRange);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', calculateInputRange);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    const calculateInputRange = useCallback((event: any) => {
        const input = inputRef?.current;
        if (!input) return;
        const progressBarRect = input.getBoundingClientRect();
        const clickX = event.clientX - (progressBarRect.left + 6);
        const percentage = ((clickX / (progressBarRect.width - 12)) * 100);
        const newValue = Math.round(Math.min(100, Math.max(0, percentage)));
        setValue(name, newValue);
    }, []);

    const handleMouseUp = useCallback((event: any) => {
        calculateInputRange(event);
        setDragging(false);
    }, []);

    const handleMouseDown = useCallback((event: any) => {
        calculateInputRange(event);
        setDragging(true);
    }, []);

    return (<div>
        <input {...register(name)} type="range" min="0" max="100" step="1" defaultValue={sliderValue} style={{display: 'none'}} />
        <RangeInputStyled onMouseDown={handleMouseDown} ref={inputRef} errors={hasError} width={width} className={readOnly === true ? 'readOnly' : undefined}>
            <RangeInputProgressStyled style={{width: `${sliderValue}%`}}></RangeInputProgressStyled>
        </RangeInputStyled>
        <InputErrorMessage errorMessage={errorMessage} />
    </div>);
};

const RangeInputStyled = styled.div`
  ${globalInputStyle};
  padding: 4px;
  position: relative;
  cursor: pointer;
  user-select: none;

  :hover {
    background: ${props => props.theme.colors.input.bg};
    border-color: ${props => props.errors ? props.theme.colors.error : props.theme.colors.input.border};

    div {
      background: ${props => props.theme.colors.input.hoverBorder};
    }
  }

  &.readOnly {
    pointer-events: none;
    color: ${props => props.theme.colors.input.textDisabled};
    filter: saturate(0%);
  }
`;

const RangeInputProgressStyled = styled.div`
  background: ${props => props.theme.colors.buttonPrimary.hoverBg};
  border-radius: 7px;
  height: 30px;
`;
