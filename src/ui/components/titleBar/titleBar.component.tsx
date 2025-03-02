import styled from 'styled-components';
import { WindowState } from '../../../shared/enums/windowState';
import IconButton from '../buttons/iconButton.component';
import useGameDetector from '../../hooks/gameDetector.hook';
import useSocketConnection from '../../hooks/socketConnection.hook';
import TitleBarSelect from './titleBarSelect.component';
import UpdateDrawer from '../drawer/updateDrawer/updateDrawer.component';
import NotificationDrawer from '../drawer/notificationDrawer/notificationDrawer.component';

export default function TitleBar() {

  const { color: color, icon: socketIcon } = useSocketConnection();
  const { gamesDetectedColor, gameDetectionIcon } = useGameDetector();

  function setWindowState(state: WindowState) {
    window.IPC.send('window:state', state);
  }

  return (<TitleBarStyled>
    <StatusStyled>
      <i className={gameDetectionIcon} style={{ color: gamesDetectedColor }} />
      <i className={socketIcon} style={{ color: color }} />
    </StatusStyled>
    <ButtonsStyled>
      <DrawersStyled>
        <NotificationDrawer />
        <UpdateDrawer />
      </DrawersStyled>
      <TitleBarSelect />
      <IconButton role={'normal'} tooltip={false} size={'small'} onClick={() => setWindowState('Tray')} icon={'ri-arrow-right-down-line'} />
      <IconButton role={'normal'} tooltip={false} size={'small'} onClick={() => setWindowState('Minimize')} icon={'ri-subtract-fill'} />
      <IconButton role={'normal'} tooltip={false} size={'small'} onClick={() => setWindowState('Exit')} icon={'ri-close-fill'} />
    </ButtonsStyled>
  </TitleBarStyled>);
}

const TitleBarStyled = styled.div`
  width: 100%;
  background-color: ${props => props.theme.colors.ui.background3};
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  padding: 0 8px;
  z-index: 200;
`;

const StatusStyled = styled.div`
  display: flex;
  align-items: center;
  font-size: 30px;

  i {
    padding: 8px;
    text-shadow: 0 0 3px black;
  }
`;

const ButtonsStyled = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  -webkit-app-region: none;
`;

const DrawersStyled = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin: 0 15px;
`;