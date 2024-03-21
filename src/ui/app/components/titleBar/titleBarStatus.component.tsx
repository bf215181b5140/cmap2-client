import styled from 'styled-components';
import useWebsocketConnection from '../../shared/hooks/websocketConnection.hook';

export function TitleBarStatus() {

    const {websocketConnection} = useWebsocketConnection();

    return (<TitleBarStatusStyled>
        <span>{websocketConnection.status}</span>
    </TitleBarStatusStyled>);
}

const TitleBarStatusStyled = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 25px;
`;
