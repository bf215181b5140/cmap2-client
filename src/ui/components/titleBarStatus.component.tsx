import styled from "styled-components";
import { useContext } from 'react';
import { ConnectionStatusContext } from '../App';

export function TitleBarStatus() {

    const connection = useContext(ConnectionStatusContext);

    // function ConnectionInfo() {
    //     switch (connection.state) {
    //         case SocketConnectionState.CONNECTING:
    //             return <span>{connection.message}</span>;
    //         default:
    //             return <span>Unknown</span>;
    //     }
    // }

    return (<TitleBarStatusStyled>
        <span>{connection.message}</span>
    </TitleBarStatusStyled>);
}

const TitleBarStatusStyled = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
