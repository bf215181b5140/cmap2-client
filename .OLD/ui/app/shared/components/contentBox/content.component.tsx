import styled from 'styled-components';
import { ReactProps } from 'cmap2-shared';

interface ContentProps extends ReactProps {
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
}

export default function Content({ flexDirection, children }: ContentProps) {

    return (<ContentStyled flexDirection={flexDirection}>
        {children}
    </ContentStyled>);
}

export const CONTENT_GAP: string = '20px';

const ContentStyled = styled.div<{ flexDirection?: string }>`
  margin: 20px;
  display: flex;
  flex-direction: ${props => props.flexDirection ? props.flexDirection : 'row'};
  flex-wrap: wrap;
  gap: ${CONTENT_GAP};
`;

