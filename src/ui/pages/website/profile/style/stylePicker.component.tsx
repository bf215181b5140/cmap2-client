import React, { useEffect, useState } from 'react';
import { ButtonDTO, ButtonImageOrientation, ButtonType, ProfilePageDTO, ReactProps, StyleDTO, StylesDTO, StylesSchema } from 'cmap2-shared';
import styled from 'styled-components';
import Segment from '../../../../components/segment/segment.component';
import PickerOverlayTier from '../../../../components/pickerOverlay/PickerOverlayTier.component';
import PickerOverlayCheck from '../../../../components/pickerOverlay/PickerOverlayCheck.component';
import ParameterButton from 'cmap2-shared/dist/react/components/parameter.button';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';

interface StylePickerProps extends ReactProps {
    profile: ProfilePageDTO;
    setStyle: (style: StyleDTO) => void;
}

export default function StylePicker({ profile, setStyle }: StylePickerProps) {

    const { GET, POST } = useCmapFetch();
    const [styles, setStyles] = useState<StylesDTO | undefined>();

    useEffect(() => {
        GET('profile/style', StylesSchema, data => {
            setStyles(data);
        });
    }, []);

    function saveSelected(style: StylesDTO[0]) {
        if (profile.tier.rank < style.tier.rank) return;

        POST('profile/style', { id: style.id }, undefined, () => {
            setStyle(style);
        });
    }

    const exampleButton: ButtonDTO = {
        id: '',
        label: '',
        path: '',
        value: '',
        valueAlt: '',
        buttonType: ButtonType.Button,
        imageOrientation: ButtonImageOrientation.Square,
        order: 0,
        useCost: null,
        interactionKeyId: null,
    };

    return (<Segment segmentTitle={'Website style'} loading={!styles}>
        <ButtonStyleFlex>
            {styles?.map(style => (
                <ButtonStylePickerStyled color={style.tier.color} validPick={profile.tier.rank >= style.tier.rank} onClick={() => saveSelected(style)} key={style.id}>
                    <ParameterButton style={style} button={exampleButton} />
                    <PickerOverlayTier tier={style.tier} />
                    <PickerOverlayCheck selected={profile.style.id === style.id} />
                </ButtonStylePickerStyled>
            ))}
        </ButtonStyleFlex>
    </Segment>);
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
        border-color: ${props => props.validPick ? props.theme.colors.buttons.primary.activeBorder : props.theme.colors.error};
    }

`;
