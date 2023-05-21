import { ContentBox, ParameterButton } from 'cmap2-shared/dist/react';
import { AvatarDto, ButtonDto, LayoutDto, ReactProps, TierDto } from 'cmap2-shared';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';
import { AvatarReducerAction } from '../../avatars.reducer';
import { ButtonStyleDto } from 'cmap2-shared/src';
import AddNewButton from './addNew.button';
import LayoutFormComponent from './layoutForm/layoutForm.component';

interface LayoutComponentProps extends ReactProps {
    layout: LayoutDto;
    order: number;
    avatar: AvatarDto;
    clientTier: TierDto;
    buttonStyle: ButtonStyleDto;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function LayoutComponent({layout, order, avatar, avatarDataDispatch, clientTier, buttonStyle}: LayoutComponentProps) {

    const navigate = useNavigate();

    return (<ContentBox title={layout.label} flexBasis={layout.width}>
        <LayoutFormComponent layout={layout} order={order} avatarId={avatar.id} avatarDataDispatch={avatarDataDispatch} />
        {layout.id &&
            <ButtonsWrapper>
                {layout.buttons?.map((button: ButtonDto) => (
                    <ParameterButton button={button} key={button.id} flexBasis="calc(25% - (3 * 15px / 4))" buttonStyle={buttonStyle}
                                     onClick={() => navigate('/avatars/' + avatar.id + '/' + layout.id + '/' + button.id)} />
                ))}
                {(clientTier.buttons && (!layout.buttons || layout.buttons.length < clientTier.buttons)) &&
                    <AddNewButton onClick={() => navigate('/avatars/' + avatar.id + '/' + layout.id + '/new')} />}
            </ButtonsWrapper>}
    </ContentBox>);
}

const ButtonsWrapper = styled.div`
  column-width: 160px;
  column-fill: balance;
  gap: 15px;

  text-align: center;

  margin: 0;
  padding: 0;

  > div {
    margin-bottom: 15px;
    //display: inline-flex;
    //flex-direction: column;
    //width: 100%;
    //min-width: 160px;
    //max-width: 230px;
    //margin: 0;
    //padding: 0;
  }
`;
