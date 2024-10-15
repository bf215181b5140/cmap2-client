import styled from 'styled-components';
import { PAGE_ELEMENT_GAP } from '../page/page.component';

const Section = styled.div<{ direction?: 'row' | 'column'}>`
  display: flex;
  flex-direction: ${props => props.direction ? props.direction : 'row'};
  gap: ${PAGE_ELEMENT_GAP}
`;

export default Section;