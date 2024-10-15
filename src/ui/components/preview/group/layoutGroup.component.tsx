import styled from 'styled-components';
import { GroupWidth } from 'cmap2-shared';
import { PAGE_ELEMENT_GAP } from '../../page/page.component';
import './layoutGroup.style.css';

const LayoutGroup = styled.div.attrs(() => ({ className: 'layoutGroup' }))<{ width?: GroupWidth }>`
  padding: 20px;
  min-width: 300px;

  .layoutGroupLabel {
    margin-top: 0;
  }

  background: #163136;
  flex: ${props => {
    switch (props.width) {
      case 'None':
        return '1';
      case 'Third':
        return `calc(100% * (1 / 3) - ${PAGE_ELEMENT_GAP})`;
      case 'Half':
        return ` calc(100% * (1 / 2) - ${PAGE_ELEMENT_GAP})`;
      case 'Full':
        return ` calc(100%)`;
      default:
        return undefined;
    }
  }};
`;

export default LayoutGroup;