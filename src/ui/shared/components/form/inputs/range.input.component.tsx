import React, { useState, useRef, useEffect, useCallback, PropsWithChildren } from 'react';
import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import { globalInputStyle } from '../formInput.style';
import { ReactProps } from 'cmap2-shared';
import { UseFormWatch } from 'react-hook-form';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form/dist/types/form';

interface RangeInputProps extends ReactProps {
    name: string;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    watch: UseFormWatch<any>;
    min?: number;
    max?: number;
    defaultValue?: number;
    errors?: boolean;
    readOnly?: boolean;
    width?: string;
}

export default function RangeInput({name, register, setValue, watch, defaultValue, errors, readOnly, width, min = 0, max = 100}: RangeInputProps) {
    const sliderValue = watch(name);
    const inputRef = useRef<any>(null);
    const [dragging, setDragging] = useState(false);

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
        <RangeInputStyled onMouseDown={handleMouseDown} ref={inputRef} errors={errors} width={width}>
            <RangeInputProgressStyled style={{width: `${sliderValue}%`}}></RangeInputProgressStyled>
        </RangeInputStyled>
    </div>);
};

const RangeInputStyled = styled.div`
  ${globalInputStyle};
  padding: 4px;
  position: relative;
  cursor: pointer;
  user-select: none;

  :hover {
    background: ${colors['ui-primary-1']};
    border-color: ${props => props.errors ? colors['error'] : colors['ui-primary-2']};

    div {
      background: ${colors['ui-primary-4']};
    }
  }
`;

const RangeInputProgressStyled = styled.div`
  background: ${colors['button-hover-bg']};
  border-radius: 7px;
  height: 30px;
`;
