import styled from 'styled-components';

export const PAGE_ELEMENT_GAP: string = '20px';

export const Page = styled.div<{ flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse' }>`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: ${props => props.flexDirection ? props.flexDirection : 'row'};
  flex-wrap: ${props => props.flexDirection?.includes('column') ? 'nowrap' : 'wrap'};
  margin: 0;
  padding: ${PAGE_ELEMENT_GAP};
  gap: ${PAGE_ELEMENT_GAP};
  align-self: flex-start;
  align-content: flex-start;
  position: relative;
`;
