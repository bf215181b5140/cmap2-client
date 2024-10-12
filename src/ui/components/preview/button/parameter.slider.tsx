import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';

interface ParameterSliderProps {
  value: number;
  step: number;
  min: number;
  max: number;
  disabled: boolean;
  className: string;
  onClick: (value: string) => void;
}

export default function ParameterSlider({ value, step, min, max, disabled, className, onClick }: ParameterSliderProps) {

  const inputRef = useRef<any>(null);
  const width = ((value - min) / (max - min)) * 100;

  const calculateInputRange = useCallback((event: any) => {
    const input = inputRef?.current;
    if (!input) return;
    const progressBarRect = input.getBoundingClientRect();
    const clickX = event.clientX - (progressBarRect.left + 6);
    const percentage = ((clickX / (progressBarRect.width - 12)) * 100);
    let newValue = min + (percentage * ((max - min) / 100));
    // round to int
    if (step === 1) {
      newValue = Math.round(newValue);
    }
    onClick(newValue.toString());
  }, []);

  const handleMouseDown = useCallback((event: any) => {
    calculateInputRange(event);
  }, []);

  return (<>
    <input type="range" min={min} max={max} step={step} defaultValue={value} style={{ display: 'none' }} />
    <ParameterSliderStyled onMouseDown={handleMouseDown} ref={inputRef} className={className + (disabled ? 'readOnly' : '')}>
      <div style={{ width: `${width}%` }}></div>
    </ParameterSliderStyled>
  </>);
};

const ParameterSliderStyled = styled.div`
  border-radius: 7px;
  transition: 0.1s linear;
  height: 44px;
  min-width: 180px;
  display: block;
  padding: 4px;
  position: relative;
  cursor: pointer;
  user-select: none;
  width: 100%;

  > div {
    background: ${props => props.theme.colors.buttons.primary.hoverBg};
    border-radius: 7px;
    height: 100%;
  }

  :hover {
    background: ${props => props.theme.colors.input.bg};
    border-color: ${props => props.theme.colors.input.border};

    div {
      background: ${props => props.theme.colors.input.hoverBorder};
    }
  }

  &.layoutStyle-1 {
    background: ${props => props.theme.colors.buttons.primary.bg};
    border: 2px solid ${props => props.theme.colors.buttons.primary.border};
    border-radius: 8px;

    :hover {
      > div {
        background: ${props => props.theme.colors.buttons.primary.hoverBorder};
      }
    }
  }

  &.layoutStyle-2 {
    background: ${props => props.theme.colors.buttons.secondary.bg};
    border: 2px solid ${props => props.theme.colors.buttons.secondary.border};
    border-radius: 8px;

    :hover {
      > div {
        background: ${props => props.theme.colors.buttons.secondary.hoverBorder};
      }
    }
  }

  &.readOnly {
    pointer-events: none;
    filter: saturate(0%);
  }
`;
