import styled from 'styled-components';
import { ReactProps } from 'cmap2-shared';
import { Tooltip } from 'react-tooltip';

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
  }
`;
