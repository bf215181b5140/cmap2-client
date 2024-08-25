import styled from 'styled-components';
import { WindowState } from '../../../shared/enums';
import IconButton from '../buttons/iconButton.component';

export default function TitleBar() {

    // const {websocketConnectionColor} = useWebsocketConnection();
    // const {vrcStatusColor} = useVrcConnection();

    function setWindowState(state: WindowState) {
        window.IPC.send('setWindowState', state);
    }

    return (<TitleBarStyled>
        <StatusStyled>
            <i className={'ri-gamepad-line'} ></i>
            <i className={'ri-global-line'} ></i>
        </StatusStyled>
        <ButtonsStyled>
            <IconButton role={'normal'} tooltip={false} size={'small'} onClick={() => setWindowState(WindowState.Minimize)} icon={'ri-subtract-fill'} />
            <IconButton role={'normal'} tooltip={false} size={'small'} onClick={() => setWindowState(WindowState.Tray)} icon={'ri-arrow-right-down-line'} />
            <IconButton role={'normal'} tooltip={false} size={'small'} onClick={() => setWindowState(WindowState.Exit)} icon={'ri-close-fill'} />
        </ButtonsStyled>
    </TitleBarStyled>);
}

const TitleBarStyled = styled.div`
    width: 70%;
    background-color: ${props => props.theme.colors.ui.background2};
    border-radius: 8px 8px 0 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    -webkit-app-region: drag;
    -webkit-user-select: none;
`;

const StatusStyled = styled.div`
    display: flex;
    align-items: center;
    margin-left: 10px;
    font-size: 30px;

    i {
        padding: 8px;
        text-shadow: 0 0 3px black;
    }
`;

const ButtonsStyled = styled.div`
    align-content: center;
    margin-right: 8px;
    -webkit-app-region: none;
`;
