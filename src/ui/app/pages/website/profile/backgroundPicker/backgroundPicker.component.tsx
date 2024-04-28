import React from 'react';
import { BackgroundDTO, ClientDTO, ReactProps } from 'cmap2-shared';
import styled from 'styled-components';
import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import Background from 'cmap2-shared/src/react/components/background.component';
import PickerOverlayCheck from '../../../../shared/components/pickerOverlay/PickerOverlayCheck.component';
import PickerOverlayTier from '../../../../shared/components/pickerOverlay/PickerOverlayTier.component';
import ContentBox from '../../../../shared/components/contentBox/contentBox.component';

interface BackgroundPickerProps extends ReactProps {
    client: ClientDTO | null;
    setFunction: (background: BackgroundDTO) => void;
    backgrounds: BackgroundDTO[] | null;
}

export default function BackgroundPicker({client, setFunction, backgrounds}: BackgroundPickerProps) {

    const customFetch = useCmapFetch();

    function saveSelected(background: BackgroundDTO) {
        if ((client?.tier?.rank || 0) < background.tier.rank) return;
        customFetch('profile/background', {
            method: 'POST',
            body: JSON.stringify(background),
            headers: {'Content-Type': 'application/json'}
        }, () => {
            setFunction(background);
        });
    }

    return (<ContentBox contentTitle={'Website background'} flexBasis="100%" loading={!client}>
        <BackgroundFlex>
            {backgrounds?.map(background => (
                <BackgroundPickerStyled color={background.tier.color} validPick={(client?.tier?.rank || 0) >= background.tier.rank}
                                        onClick={() => saveSelected(background)} key={background?.className}>
                    <Background background={background} />
                    <PickerOverlayTier tier={background.tier} />
                    <PickerOverlayCheck selected={client?.background?.className === background?.className} />
                </BackgroundPickerStyled>
            ))}
        </BackgroundFlex>
    </ContentBox>);
}

const BackgroundFlex = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
`;

const BackgroundPickerStyled = styled.div<{ color: string, validPick: boolean }>`
  position: relative;
  margin: 0;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  border-radius: 1em;
  border: 2px solid ${props => props.theme.colors.buttons.primary.border};
  transition: 0.1s linear;
  flex-basis: calc(25% - (3 * 15px / 4));
  aspect-ratio: 16/9;

  :hover {
    border-color: ${props => props.validPick ? props.theme.colors.buttons.primary.activeBorder : props.theme.colors.error};
  }

`;

