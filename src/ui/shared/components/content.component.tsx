import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';

interface ContentProps extends ReactProps {
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
}

export default function Content(props: ContentProps) {

    return(<ContentStyled flexDirection={props.flexDirection}>
        {props.children}
    </ContentStyled>)
}

const ContentStyled = styled.div<{ flexDirection?: string }>`
  margin: 20px;
  display: flex;
  flex-direction: ${props => props.flexDirection ? props.flexDirection : 'row'};
  flex-wrap: wrap;
  //align-items: flex-start;
  gap: 20px;
`;
