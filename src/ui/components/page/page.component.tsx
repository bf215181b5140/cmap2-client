import styled from 'styled-components';

export const PAGE_ELEMENT_GAP: string = '20px';

export const Page = styled.div<{ flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse' }>`
    width: 100%;
    height: min-content;
    display: flex;
    flex-wrap: wrap;
    flex-direction: ${props => props.flexDirection ? props.flexDirection : 'row'};
    margin: 0;
    padding: ${PAGE_ELEMENT_GAP};
    gap: ${PAGE_ELEMENT_GAP};
`;
