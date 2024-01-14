import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { globalInputStyle } from '../formInput.component';
import colors from 'cmap2-shared/src/colors.json';

export default function RangeInput() {
    const [sliderValue, setSliderValue] = useState(50);
    const inputRef = useRef<any>(null);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event: any) => {
            console.log('mouse moving');
            if (!dragging) return;
            const input = inputRef?.current;
            if (!input) return;
            const progressBarRect = input.getBoundingClientRect();
            const clickX = event.clientX - (progressBarRect.left + 6);
            const percentage = ((clickX / (progressBarRect.width - 12)) * 100);
            const newValue = Math.min(100, Math.max(0, percentage));
            setSliderValue(newValue);
        };

        const handleMouseUp = () => {
            setDragging(false);
        };

        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    const handleMouseDown = () => {
        setDragging(true);
    };

    return (
        <div>
            <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={sliderValue}
                style={{display: 'none'}} // Hide the default input element
                ref={inputRef}
            />
            <RangeInputStyled onMouseDown={handleMouseDown} ref={inputRef}>
                <RangeInputProgressStyled width={sliderValue}></RangeInputProgressStyled>
            </RangeInputStyled>
            <p>{sliderValue}</p>
        </div>
    );
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

const RangeInputProgressStyled = styled.div<{ width: number }>`
  width: ${props => props.width ? `${props.width}%` : '0%'};
  background: ${colors['button-hover-bg']};
  border-radius: 7px;
  height: 30px;
`;
