import React from 'react';
import ContentBox from '../../../shared/components/contentBox.component';
import { ReactProps } from '../../../../shared/global';
import { ButtonDto, ButtonStyleDto, ClientDto } from 'cmap2-shared';
import ParameterButton from 'cmap2-shared/src/components/parameter.button';
import useCustomFetch from '../../../shared/hooks/customFetch.hook';
import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import PickerOverlayCheck from '../../../shared/components/pickerOverlay/PickerOverlayCheck.component';
import PickerOverlayTier from '../../../shared/components/pickerOverlay/PickerOverlayTier.component';

interface ButtonStylePickerProps extends ReactProps {
    client: ClientDto | null;
    setFunction: (buttonStyle: ButtonStyleDto) => void;
    buttonStyles: ButtonStyleDto[] | null;
}

export default function ButtonStylePicker({client, setFunction, buttonStyles}: ButtonStylePickerProps) {

    const customFetch = useCustomFetch();

    function saveSelected(buttonStyle: ButtonStyleDto) {
        if ((client?.tier?.rank || 0) < buttonStyle.tier.rank) return;
        customFetch('profileButtonStyle', {
            method: 'POST',
            body: JSON.stringify(buttonStyle),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.code === 200) {
                setFunction(buttonStyle);
            }
        });
    }

    function exampleButton(): ButtonDto {
        const button = new ButtonDto();
        button.label = 'Example button';
        return button;
    }

    return (<ContentBox flexBasis="100%" loading={!client}>
        <h2>Button style</h2>
        <ButtonStyleFlex>
            {buttonStyles?.map(buttonStyle => (
                <ButtonStylePickerStyled color={buttonStyle.tier.color} validPick={(client?.tier?.rank || 0) >= buttonStyle.tier.rank}
                                         onClick={() => saveSelected(buttonStyle)} key={buttonStyle?.id}>
                    <ParameterButton buttonStyle={buttonStyle} button={exampleButton()} />
                    <PickerOverlayTier tier={buttonStyle.tier} />
                    <PickerOverlayCheck selected={client?.buttonStyle?.id === buttonStyle?.id} />
                </ButtonStylePickerStyled>
            ))}
        </ButtonStyleFlex>
    </ContentBox>);
}

const ButtonStyleFlex = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
`;

const ButtonStylePickerStyled = styled.div<{ color: string, validPick: boolean }>`
  position: relative;
  margin: 0;
  padding: 20px 15px;
  cursor: pointer;
  transition: 0.1s linear;
  flex-basis: calc(25% - (3 * 15px / 4));

  :hover {
    border-color: ${props => props.validPick ? colors['button-active-border'] : colors['error']};
  }

`;
