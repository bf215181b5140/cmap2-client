import styled from "styled-components";
import { ReactProps } from 'cmap2-shared';
import { SocketConnection } from '../../../shared/SocketConnection';

interface TitleBarStatusProps extends ReactProps {
    socketConnection: SocketConnection;
}

export function TitleBarStatus(props: TitleBarStatusProps) {

    return (<TitleBarStatusStyled>
        <span>{props.socketConnection.message}</span>
    </TitleBarStatusStyled>);
}

const TitleBarStatusStyled = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 25px;
`;
