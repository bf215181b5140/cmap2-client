import { Toy, ToyCommand } from 'lovense';
import ActionButton from '../../../shared/components/actionButton.component';
import FormTable from '../../../shared/components/form/formTable.component';
import FormInput from '../../../shared/components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';
import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import gushImage from '../icons/lovenseToyGush.png';
import otherToyImage from '../icons/lovenseToyOther.png';
import Icon from 'cmap2-shared/src/react/components/icon.component';

interface LovenseToyProps {
    toy: Toy,
}

export function LovenseToy({toy}: LovenseToyProps) {

    const {register, setValue, reset, formState: {errors}, handleSubmit} = useForm({
        resolver: zodResolver(z.object({
            action: z.string(),
            timeSec: z.number()
        }))
    });

    function onSubmit(formData: any) {
        const toyCommand: ToyCommand = {...formData, command: 'Function', toy: toy.id, apiVer: 1};
        window.electronAPI.sendLovenseToyCommand(toyCommand);
    }

    function sendTestCommand() {
        const toyCommand: ToyCommand = {
            command: 'Function',
            action: 'Vibrate:' + Math.floor(Math.random() * 10) + 2,
            timeSec: 1,
            toy: toy.id,
            apiVer: 1
        };
        window.electronAPI.sendLovenseToyCommand(toyCommand);
    }

    function toyImage() {
        switch (toy.toyType) {
            case 'gush':
                return gushImage;
            default:
                return otherToyImage;
        }
    }

    function batteryImage() {
        if (toy.battery >= 50) {
            return <Icon icon='ri-battery-fill' color='green' />;
        } else if (toy.battery < 50 && toy.battery >= 0) {
            return <Icon icon='ri-battery-low-line' color='red' />;
        } else {
            return <Icon icon='ri-battery-line' color='grey' />;
        }
    }

    return (
        <LovenseToyStyled onClick={() => sendTestCommand()}>
            <LovenseToyImageStyled src={toyImage()} />
            <LovenseToyInfoStyled>
                <h2>{toy.nickname} {batteryImage()}</h2>
                <p>{toy.name} - {toy.id}</p>
                <span style={{color: 'grey'}}>Click to send a quick vibration</span>
            </LovenseToyInfoStyled>
        </LovenseToyStyled>
    );
}

const LovenseToyStyled = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: ${colors['content-bg']};
  border: 2px solid ${colors['content-bg']};
  border-radius: 1em;
  cursor: pointer;
  transition: 0.15s linear;

  :hover {
    background-color: ${colors['button-hover-bg']};
    border: 2px solid ${colors['button-hover-border']};
  }
`;

const LovenseToyImageStyled = styled.div<{ src: string }>`
  background: url(${props => props.src}) no-repeat center;
  background-size: cover;
  height: 100%;
  aspect-ratio: 16/9;
  border-radius: 1em;
`;

const LovenseToyInfoStyled = styled.div`
  margin: 10px;
`;
