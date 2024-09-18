import styled from 'styled-components';

export const SegmentTable = styled.table<{ maxHeight?: string }>`
    display: block;
    border-collapse: collapse;
    background: ${props => props.theme.colors.ui.background5};
    border-radius: 8px;
    padding: 6px;
    max-height: ${props => props.maxHeight || '300px'};
    overflow: auto;
    
    td, th {
        padding: 3px 6px;
        text-align: left;
    }

    thead th {
        padding-left: 10px;
        font-size: 18px;
        color: ${props => props.theme.colors.font.h2};
        text-shadow: 0 0 3px #000000cc;
    }

    tbody {
        font-family: Noto-Sans-Regular, serif;
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

`;
