import styled from "styled-components";
import {WindowState} from "../../shared/enums";
import ActionButton from "./buttons/action.button";
import {TitleBarStatus} from "./titleBarStatus.component";
import colors from '../style/colors.json';

export default function TitleBar(props: any) {

    function setWindowState(state: WindowState) {
        window.electronAPI.setWindowState(state);
    }

    return (<TitleBarStyled>
        <TitleBarStatus socketConnection={props.socketConnection} />
        <TitleBarButtons>
            <ActionButton action={() => setWindowState(WindowState.MINIMIZE)} icon={"ri-subtract-fill"}>Minimize</ActionButton>
            <ActionButton action={() => setWindowState(WindowState.TRAY)} icon={"ri-arrow-right-down-line"}>Tray</ActionButton>
            <ActionButton action={() => setWindowState(WindowState.EXIT)} icon={"ri-close-fill"}>Exit</ActionButton>
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
