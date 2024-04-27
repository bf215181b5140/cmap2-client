import { ParameterButton } from 'cmap2-shared/dist/react';
import { AvatarDTO, ButtonDTO, LayoutDTO, ReactProps, TierDTO } from 'cmap2-shared';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import styled from 'styled-components';
import { AvatarReducerAction } from '../../avatars.reducer';
import { ButtonStyleDTO } from 'cmap2-shared/src';
import AddNewButton from './addNew.button';
import LayoutFormComponent from './layoutForm/layoutForm.component';
import { InteractionKeyDTO } from 'cmap2-shared/dist/types/InteractionKey';
import ContentBox from '../../../../../shared/components/contentBox/contentBox.component';
import IconButton from '../../../../../shared/components/buttons/iconButton.component';

interface LayoutComponentProps extends ReactProps {
    layout: LayoutDTO;
    order: number;
    avatar: AvatarDTO;
    clientTier: TierDTO;
    buttonStyle: ButtonStyleDTO;
    interactionKeys: InteractionKeyDTO[];
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function LayoutComponent({ layout, order, avatar, avatarDataDispatch, clientTier, buttonStyle, interactionKeys }: LayoutComponentProps) {

    const navigate = useNavigate();
    const [inEdit, setEditing] = useState<boolean>(!layout.id);

    return (<ContentBox key={layout.id} flexBasis={layout.width}>

        {layout.id && <>
            <FloatIconButton type={'edit'} size={'small'} onClick={() => setEditing(!inEdit)} active={inEdit} />
            <h2 style={{ marginTop: '0' }}>{layout.label}</h2>
        </>}

        {inEdit && <LayoutFormComponent layout={layout} order={order} avatarId={avatar.id!} interactionKeys={interactionKeys}
                                        avatarDataDispatch={avatarDataDispatch} />}

        {layout.id && <>
            <div style={{ clear: 'both' }} />
            <hr />
        </>}

        {layout.id &&
            <ButtonsWrapper>
                {layout.buttons?.map((button: ButtonDTO) => (
                    <ParameterButton button={button} key={button.id} buttonStyle={buttonStyle}
                                     onClick={() => navigate('/website/avatars/' + avatar.id + '/' + layout.id + '/' + button.id)} />
                ))}
                {(clientTier.buttons && (!layout.buttons || layout.buttons.length < clientTier.buttons)) &&
                    <AddNewButton onClick={() => navigate('/website/avatars/' + avatar.id + '/' + layout.id + '/new')} />}
            </ButtonsWrapper>}
    </ContentBox>);
}

const ButtonsWrapper = styled.div`
  column-width: 180px;
  column-fill: balance;
  gap: 15px;

  text-align: center;

  margin: 0;
  padding: 0;

  > div {
    margin-bottom: 15px;
  }
`;

const FloatIconButton = styled(IconButton)`
  float: right;
  margin: 0 0 7px 7px;
`;
