import styled from "styled-components";
import {WindowState} from "../../shared/enums";
import ActionButton from "./buttons/action.button";
import {TitleBarStatus} from "./titleBarStatus.component";
import colors from '../style/colors.json';

export default function TitleBar() {

    function setWindowState(state: WindowState) {
        window.electronAPI.setWindowState(state);
    }

    return (<TitleBarStyled>
        <TitleBarStatus />
        <TitleBarButtons>
            <ActionButton action={() => setWindowState(WindowState.MINIMIZE)} icon={"ri-subtract-fill"}>Minimize</ActionButton>
            <ActionButton action={() => setWindowState(WindowState.HIDE)} icon={"ri-close-fill"}>Close</ActionButton>
            <ActionButton action={() => setWindowState(WindowState.CLOSE)} icon={"ri-close-fill"}>Exit</ActionButton>
        </TitleBarButtons>
    </TitleBarStyled>);
}

const TitleBarStyled = styled.div`
  width: 800px;
  padding: 0 10px;
  background-color: ${colors["ui-background-2"]};
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: row;
  justify-content: end;
  -webkit-app-region: drag;
  -webkit-user-select: none;
`;

const TitleBarButtons = styled.div`
  -webkit-app-region: none;
`;
