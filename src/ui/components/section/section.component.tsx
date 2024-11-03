import styled from 'styled-components';
import { PAGE_ELEMENT_GAP } from '../page/page.component';

const Section = styled.div<{ direction?: 'row' | 'column', flex?: string }>`
  display: flex;
  flex-direction: ${props => props.direction ? props.direction : 'column'};
  gap: ${PAGE_ELEMENT_GAP};
  flex-wrap: wrap;
`;

export default Section;