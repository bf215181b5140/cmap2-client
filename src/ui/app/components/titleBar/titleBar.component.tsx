import styled from "styled-components";
import {WindowState} from "../../../../shared/enums";
import ActionButton from "../../shared/components/buttons/actionButton.component";
import {TitleBarStatus} from "./titleBarStatus.component";

export default function TitleBar() {

    function setWindowState(state: WindowState) {
        window.electronAPI.send('setWindowState', state);
    }

    return (<TitleBarStyled>
        <TitleBarStatus />
        <TitleBarButtons>
            <ActionButton action={() => setWindowState(WindowState.MINIMIZE)} icon={"ri-subtract-fill"}>Minimize</ActionButton>
            <ActionButton action={() => setWindowState(WindowState.TRAY)} icon={"ri-arrow-right-down-line"}>Tray</ActionButton>
            <ActionButton action={() => setWindowState(WindowState.EXIT)} icon={"ri-close-fill"}>Exit</ActionButton>
        </TitleBarButtons>
    </TitleBarStyled>);
}

const TitleBarStyled = styled.div`
  width: 800px;
  padding: 0px;
  background-color: ${props => props.theme.colors.ui.background2};
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: row;
  justify-content: end;
  -webkit-app-region: drag;
  -webkit-user-select: none;
`;

const TitleBarButtons = styled.div`
  -webkit-app-region: none;
`;
