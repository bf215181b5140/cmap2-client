import styled from 'styled-components';
import { WindowState } from '../../../shared/enums/windowState';
import IconButton from '../buttons/iconButton.component';
import useVrcDetector from '../../hooks/vrcDetector.hook';
import useSocketConnection from '../../hooks/socketConnection.hook';

export default function TitleBar() {

    const { color: color } = useSocketConnection();
    const { vrcStatusColor } = useVrcDetector();

    function setWindowState(state: WindowState) {
        window.IPC.send('setWindowState', state);
    }

    return (<TitleBarStyled>
        <StatusStyled>
            <i className={'ri-gamepad-line'} style={{ color: vrcStatusColor }} />
            <i className={'ri-global-line'} style={{ color: color }} />
        </StatusStyled>
        <ButtonsStyled>
            <IconButton role={'normal'} tooltip={false} size={'small'} onClick={() => setWindowState('Tray')} icon={'ri-arrow-right-down-line'} />
            <IconButton role={'normal'} tooltip={false} size={'small'} onClick={() => setWindowState('Minimize')} icon={'ri-subtract-fill'} />
            <IconButton role={'normal'} tooltip={false} size={'small'} onClick={() => setWindowState('Exit')} icon={'ri-close-fill'} />
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
    display: flex;
    align-items: center;
    margin-right: 8px;
    -webkit-app-region: none;
`;
