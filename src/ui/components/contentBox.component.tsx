import { ReactProps } from '../../global';
import styled from 'styled-components';
import colors from '../style/colors.json';

export default function ContentBox({children}: ReactProps) {

    return(<ContentBoxStyled>
        {children}
    </ContentBoxStyled>)
}

const ContentBoxStyled = styled.div`
  background-color: ${colors['ui-background-3']};
  border-radius: 7px;
`;
