import React from 'react';
import { BackgroundDTO, StylePageDTO } from 'cmap2-shared';
import styled from 'styled-components';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import Segment from '../../../../components/segment/segment.component';
import Background from '../../../../components/background/background.component';
import PickerOverlayTier from '../../../../components/pickerOverlay/PickerOverlayTier.component';
import PickerOverlayCheck from '../../../../components/pickerOverlay/PickerOverlayCheck.component';

interface BackgroundPickerProps {
  stylesData: StylePageDTO;
  setBackground: (background: BackgroundDTO) => void;
}

export default function BackgroundPicker({ stylesData, setBackground }: BackgroundPickerProps) {

  const { POST } = useCmapFetch();

  function saveSelected(background: StylePageDTO['backgrounds'][0]) {
    if (stylesData.client.tier.rank < background.tier.rank) return;

    POST('style/background', { id: background.id }, undefined, () => {
      setBackground(background);
    });
  }

  return (<Segment segmentTitle={'Background'} width={'Full'} loading={!stylesData.backgrounds}>
    <BackgroundFlex>
      {stylesData.backgrounds?.map(background => (
        <BackgroundPickerStyled color={background.tier.color} validPick={stylesData.client.tier.rank >= background.tier.rank} onClick={() => saveSelected(background)} key={background.id}>
          <Background background={background} />
          <PickerOverlayTier tier={background.tier} valid={background.tier.rank <= stylesData.client.tier.rank} />
          <PickerOverlayCheck selected={stylesData.client.background.id === background.id} />
        </BackgroundPickerStyled>
      ))}
    </BackgroundFlex>
  </Segment>);
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
    border-radius: 8px;
    border: 2px solid ${props => props.validPick ? props.theme.colors.buttons.primary.border : props.theme.colors.error};
    transition: 0.1s linear;
    flex-basis: calc(25% - (3 * 15px / 4));
    aspect-ratio: 16/9;
    min-height: 100px; // somehow fixes one of the parent divs not calculating height properly

    @media (max-width: 1000px) {
            flex-basis: calc(33% - (2 * 15px / 3));
    }
    
    :hover {
        border-color: ${props => props.validPick ? props.theme.colors.buttons.primary.activeBorder : props.theme.colors.error};
    }
`;

