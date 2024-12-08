import React, { useEffect, useState } from 'react';
import { ButtonDTO, ProfilePageDTO, ThemeDTO, ThemesDTO, ThemesSchema } from 'cmap2-shared';
import styled from 'styled-components';
import Segment from '../../../components/segment/segment.component';
import PickerOverlayTier from '../../../components/pickerOverlay/PickerOverlayTier.component';
import PickerOverlayCheck from '../../../components/pickerOverlay/PickerOverlayCheck.component';
import useCmapFetch from '../../../hooks/cmapFetch.hook';
import ParameterButton from '../../../components/preview/button/parameter.button';

interface ThemePickerProps {
  profile: ProfilePageDTO;
  setTheme: (theme: ThemeDTO) => void;
}

export default function ThemePicker({ profile, setTheme }: ThemePickerProps) {

  const { GET, POST } = useCmapFetch();
  const [themes, setThemes] = useState<ThemesDTO | undefined>();

  useEffect(() => {
    GET('profile/theme', ThemesSchema, data => {
      setThemes(data);
    });
  }, []);

  function saveSelected(theme: ThemesDTO[0]) {
    if (profile.tier.rank < theme.tier.rank) return;

    POST('profile/theme', { id: theme.id }, undefined, () => {
      setTheme(theme);
    });
  }

  const exampleButton: ButtonDTO = {
    callbackParameters: [],
    visibilityParameters: [],
    id: '',
    label: '',
    showLabel: true,
    path: '',
    value: '',
    valueAlt: '',
    buttonType: 'Button',
    imageOrientation: 'Square',
    order: 0,
    useCost: null,
    interactionKeyId: null
  };

  return (<Segment segmentTitle={'Website theme'} loading={!themes}>
    <ButtonThemeFlex>
      {themes?.map(theme => (
        <ButtonThemePickerThemed color={theme.tier.color} validPick={profile.tier.rank >= theme.tier.rank} onClick={() => saveSelected(theme)} key={theme.id}>
          <ParameterButton theme={theme} button={exampleButton} />
          <PickerOverlayTier tier={theme.tier} valid={theme.tier.rank <= profile.tier.rank} />
          <PickerOverlayCheck selected={profile.theme.id === theme.id} />
        </ButtonThemePickerThemed>
      ))}
    </ButtonThemeFlex>
  </Segment>);
}

const ButtonThemeFlex = styled.div`
    display: flex;
    flex-direction: row;
    gap: 15px;
`;

const ButtonThemePickerThemed = styled.div<{ color: string, validPick: boolean }>`
    position: relative;
    margin: 0;
    padding: 20px 15px;
    cursor: pointer;
    transition: 0.1s linear;
    flex-basis: calc(25% - (3 * 15px / 4));

    :hover {
        border-color: ${props => props.validPick ? props.theme.colors.buttons.primary.activeBorder : props.theme.colors.error};
    }

`;
