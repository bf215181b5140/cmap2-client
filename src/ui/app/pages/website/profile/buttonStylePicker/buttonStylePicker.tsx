import React from 'react';
import { ContentBox, ParameterButton } from 'cmap2-shared/dist/react';
import { ButtonDTO, ButtonImageOrientation, ButtonStyleDTO, ButtonType, ClientDTO, ParameterValueType, ReactProps } from 'cmap2-shared';
import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import styled from 'styled-components';
import PickerOverlayCheck from '../../../../shared/components/pickerOverlay/PickerOverlayCheck.component';
import PickerOverlayTier from '../../../../shared/components/pickerOverlay/PickerOverlayTier.component';

interface ButtonStylePickerProps extends ReactProps {
    client: ClientDTO | null;
    setFunction: (buttonStyle: ButtonStyleDTO) => void;
    buttonStyles: ButtonStyleDTO[] | null;
}

export default function ButtonStylePicker({client, setFunction, buttonStyles}: ButtonStylePickerProps) {

    const customFetch = useCmapFetch();

    function saveSelected(buttonStyle: ButtonStyleDTO) {
        if (buttonStyle.tier?.rank && (client?.tier?.rank || 0) < buttonStyle.tier.rank) return;
        customFetch('profile/buttonStyle', {
            method: 'POST',
            body: JSON.stringify(buttonStyle),
            headers: {'Content-Type': 'application/json'}
        }, () => {
            setFunction(buttonStyle);
        });
    }

    function exampleButton(): ButtonDTO {
        return {
            label: 'Example button',
            buttonType: ButtonType.Button,
            image: null,
            imageOrientation: ButtonImageOrientation.Square,
            order: 0,
            path: '',
            useCost: null,
            value: '',
            valueAlt: null,
            valueType: ParameterValueType.Int,
        };
    }

    return (<ContentBox flexBasis="100%" loading={!client}>
        <h2>Button style</h2>
        <ButtonStyleFlex>
            {buttonStyles?.map(buttonStyle => (
                <ButtonStylePickerStyled color={buttonStyle.tier?.color} validPick={(client?.tier?.rank || 0) >= buttonStyle.tier.rank}
                                         onClick={() => saveSelected(buttonStyle)} key={buttonStyle?.className}>
                    <ParameterButton buttonStyle={buttonStyle} button={exampleButton()} />
                    <PickerOverlayTier tier={buttonStyle.tier} />
                    <PickerOverlayCheck selected={client?.buttonStyle?.className === buttonStyle?.className} />
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
    border-color: ${props => props.validPick ? props.theme.colors.buttonPrimary.activeBorder : props.theme.colors.error};
  }

`;
