import styled from 'styled-components';
import { ReactProps } from '../../../types';

export default function ContentMenu({ children }: ReactProps) {

  return (<ContentMenuStyled>
    {children}
  </ContentMenuStyled>);
}

const ContentMenuStyled = styled.div`
  background: ${props => props.theme.colors.segment.bg};
  position: sticky;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  z-index: 10;

  hr {
    border: 1px solid ${props => props.theme.colors.contentMenu.bg} !important;
    margin: 3px 5px !important;
    padding: 0 !important;
  }
`;
