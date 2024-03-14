import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
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
  background: ${colors['ui-background-3']};

  > div {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }
`;
