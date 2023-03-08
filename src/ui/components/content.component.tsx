import { ReactProps } from '../../shared/global';
import styled from 'styled-components';

export default function Content(props: ReactProps) {

    return(<ContentStyled>
        {props.children}
    </ContentStyled>)
}

const ContentStyled = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
`;
