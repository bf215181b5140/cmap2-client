import styled from 'styled-components';
import { ReactProps } from 'cmap2-shared';

export default function Submenu({children}: ReactProps) {

    return (<SubmenuStyled>
        <div>
            {children}
        </div>
    </SubmenuStyled>);
}

const SubmenuStyled = styled.div`
  background: ${props => props.theme.colors.ui.background3};

  > div {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    z-index: 10;
  }

  hr {
    border: 1px solid ${props => props.theme.colors.submenu.bg};
    margin: 3px 5px;
    padding: 0;
  }
`;
