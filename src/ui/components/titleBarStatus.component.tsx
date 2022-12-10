import styled from "styled-components";
import {SocketConnectionStatus} from "../../global";
import {SocketConnectionState} from "../../enums";


export function TitleBarStatus() {

    const connection: SocketConnectionStatus = {state: SocketConnectionState.CONNECTING, message: 'connecting...', description: 'Establishing connection'}

    function ConnectionInfo() {
        switch(connection.state) {
            case SocketConnectionState.CONNECTING:
                return <span>{connection.message}</span>;
            default:
                return <span>Unknown</span>;
        }

    }

    return (<TitleBarStatusStyled>
        <ConnectionInfo />
    </TitleBarStatusStyled>);
}

const TitleBarStatusStyled = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
`;