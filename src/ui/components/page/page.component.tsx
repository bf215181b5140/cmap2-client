import styled from 'styled-components';

export const PAGE_ELEMENT_GAP: string = '20px';

export const PageLayout = styled.div<{ flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse' }>`
    display: flex;
    flex-direction: ${props => props.flexDirection ? props.flexDirection : 'row'};
    flex-wrap: wrap;
    margin: ${PAGE_ELEMENT_GAP};
    gap: ${PAGE_ELEMENT_GAP};
`;
