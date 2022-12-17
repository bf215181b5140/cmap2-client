import { ReactProps } from '../../shared/global';
import styled from 'styled-components';
import colors from '../style/colors.json';

interface ContentBoxProps extends ReactProps {
    flex?: number;
    flexBasis?: string;
}

export default function ContentBox({flex, flexBasis, children}: ContentBoxProps) {

    return(<ContentBoxStyled flex={flex} flexBasis={flexBasis}>
        {children}
    </ContentBoxStyled>)
}

const ContentBoxStyled = styled.div<ContentBoxProps>`
  background-color: ${colors['ui-background-3']};
  border-radius: 8px;
  flex: ${props => props.flex || 2};
  flex-basis: ${props => props.flexBasis || '0%'};
  padding: 15px;
`;
