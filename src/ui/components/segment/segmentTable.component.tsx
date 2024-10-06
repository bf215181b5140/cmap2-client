import styled from 'styled-components';
import { ReactProps } from '../../types';
import React from 'react';

interface SegmentTableProps extends ReactProps {
    maxHeight?: string;
    className?: string;
}

export default function SegmentTable({ maxHeight, className, children }: SegmentTableProps) {
    return (<SegmentTableStyled maxHeight={maxHeight} className={className}>
        <div>
            <table>
                {children}
            </table>
        </div>
    </SegmentTableStyled>);
}

export const SegmentTableStyled = styled.div<{ maxHeight?: string }>`
    padding: 6px;
    background: ${props => props.theme.colors.ui.background5};
    border-radius: 8px;
    position: relative;

    div {
        overflow: auto;
        max-height: ${props => props.maxHeight || '300px'};

        table {
            border-collapse: collapse;
            width: 100%;

            td, th {
                padding: 3px 6px;
                text-align: left;
            }

            thead {
                position: sticky;
                top: 0;
                background: ${props => props.theme.colors.ui.background5};
            }

            thead th {
                padding-left: 10px;
                padding-bottom: 6px;
                font-size: 18px;
                color: ${props => props.theme.colors.font.h2};
                text-shadow: 0 0 3px #000000cc;
            }

            tbody {
                font-family: Noto-Sans-Regular, serif;
            }
        }

        /* Handle */

        ::-webkit-scrollbar-thumb {
            background: #303C47;
            border-radius: 8px;
        }

        /* Handle on hover */

        ::-webkit-scrollbar-thumb:hover {
            background: #3D4853;
        }
    }
`;
