import { Toy, ToyCommand } from 'lovense';
import styled, { css } from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import gushImage from '../icons/lovenseToyGush.png';
import otherToyImage from '../icons/lovenseToyOther.png';
import Icon from 'cmap2-shared/src/react/components/icon.component';

interface LovenseToyProps {
    toy: Toy,
}

export function LovenseToy({toy}: LovenseToyProps) {

    function sendTestCommand() {
        if (!toy.connected) return;
        const toyCommand: ToyCommand = {
            command: 'Function',
            action: 'Vibrate:' + Math.floor(Math.random() * 10) + 2,
            timeSec: 1,
            toy: toy.id,
            apiVer: 1
        };
        window.electronAPI.send('sendLovenseToyCommand', toyCommand);
    }

    function toyName() {
        if (toy.nickname) return toy.nickname;
        if (toy.name) return toy.name;
        return toy.toyType;
    }

    function toyImage() {
        switch (toy.toyType) {
            case 'gush':
                return gushImage;
            default:
                return otherToyImage;
        }
    }

    function statusIcon() {
        // Toy not connected
        if (!toy.connected) return <Icon icon="ri-wifi-off-fill" color="red" />;
        // Show battery level
        if (toy.battery >= 50) {
            return <Icon icon="ri-battery-fill" color="green" />;
        } else if (toy.battery < 50 && toy.battery >= 25) {
            return <Icon icon="ri-battery-low-line" color="orange" />;
        } else if (toy.battery < 25 && toy.battery >= 0) {
            return <Icon icon="ri-battery-low-line" color="red" />;
        } else {
            return <Icon icon="ri-battery-line" color="grey" />;
        }
    }

    return (
        <LovenseToyStyled onClick={() => sendTestCommand()} connected={toy.connected}>
            <LovenseToyImageStyled src={toyImage()} />
            <LovenseToyInfoStyled>
                <h2>{toyName()} {statusIcon()}</h2>
                <p>{toy.name} - {toy.id}</p>
                {toy.connected && <span>Click to send a quick vibration</span>}
                {!toy.connected && <span style={{color: 'grey'}}>Toy not connected</span>}
            </LovenseToyInfoStyled>
        </LovenseToyStyled>
    );
}

const LovenseToyStyled = styled.div<{ connected: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: ${colors['content-bg']};
  border: 2px solid darkred;
  border-radius: 8px;
  transition: 0.15s linear;

  ${props => props.connected ? LovenseToyConnectedStyled : null};
`;

const LovenseToyConnectedStyled = css`
  border: 2px solid ${colors['button-hover-border']};
  cursor: pointer;
  
  :hover {
    background-color: ${colors['button-hover-bg']};
    border: 2px solid ${colors['button-hover-border']};
  }
`;

const LovenseToyImageStyled = styled.div<{ src: string }>`
  background: url(${props => props.src}) no-repeat center;
  width: 100px;
  border-radius: 1em;
`;

const LovenseToyInfoStyled = styled.div`
  margin: 10px;
  
  p, span {
    display: block;
    margin: 5px 0;
    padding: 0;
  }
  
  h2 {
    margin: 5px 0 8px 0;
  }
`;
