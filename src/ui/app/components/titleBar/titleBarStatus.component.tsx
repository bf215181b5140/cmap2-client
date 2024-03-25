import styled from 'styled-components';
import useWebsocketConnection from '../../shared/hooks/websocketConnection.hook';
import useVrcConnection from '../../shared/hooks/vrcConnection.hook';

export function TitleBarStatus() {

    const {websocketConnectionColor} = useWebsocketConnection();
    const {vrcStatusColor} = useVrcConnection();

    return (<TitleBarStatusStyled>
        <i className={'ri-gamepad-line'} style={{color: vrcStatusColor}}></i>
        <i className={'ri-global-line'} style={{color: websocketConnectionColor}}></i>
    </TitleBarStatusStyled>);
}

const TitleBarStatusStyled = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 25px 0 25px;
  font-size: 30px;

  i {
    padding-right: 20px;
    text-shadow: 0 0 3px black;
  }
`;
