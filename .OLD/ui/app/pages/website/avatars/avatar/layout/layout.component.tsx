import { ParameterButton } from 'cmap2-shared/src/react';
import { AvatarDTO, ButtonDTO, LayoutDTO, ReactProps, TierDTO } from 'cmap2-shared';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import styled from 'styled-components';
import { AvatarReducerAction } from '../../avatars.reducer';
import { ButtonStyleDTO } from 'cmap2-shared/src';
import AddNewButton from './addNew.button';
import LayoutFormComponent from './layoutForm/layoutForm.component';
import { InteractionKeyDTO } from 'cmap2-shared/src/types/InteractionKey';
import ContentBox from '../../../../../shared/components/contentBox/contentBox.component';
import IconButton from '../../../../../shared/components/buttons/iconButton.component';
import useCmapFetch from '../../../../../shared/hooks/cmapFetch.hook';

interface LayoutComponentProps extends ReactProps {
    layout: LayoutDTO;
    order: number;
    avatar: AvatarDTO;
    clientTier: TierDTO;
    buttonStyle: ButtonStyleDTO;
    interactionKeys: InteractionKeyDTO[];
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
    changeOrder?: (layout: LayoutDTO, change: number) => void;
}

export default function LayoutComponent({ layout, order, avatar, avatarDataDispatch, clientTier, buttonStyle, interactionKeys, changeOrder }: LayoutComponentProps) {

    const navigate = useNavigate();
    const cmapFetch = useCmapFetch();
    const [inEdit, setEditing] = useState<boolean>(!layout.id);
    const buttons = layout?.buttons?.sort((a, b) => a.order - b.order) || [];

    function reorderButtons(button: ButtonDTO, change: number) {
        const oldPos = button.order;
        const newPos = Math.min(Math.max(button.order + change, 0), (buttons.length || 1) - 1);
        let newButtonOrder: ButtonDTO[] = [];

        if (change < 0) {
            newButtonOrder = buttons.map((b, index) => {
                if (b.id === button.id) {
                    b.order = newPos;
                    return b;
                } else {
                    if (index >= newPos && index < oldPos) {
                        b.order = index + 1;
                    } else {
                        b.order = index;
                    }
                }
                return b;
            });
        } else if (change > 0) {
            newButtonOrder = buttons.map((b, index) => {
                if (b.id === button.id) {
                    b.order = newPos;
                    return b;
                } else {
                    if (b.order <= newPos && b.order > oldPos) {
                        b.order = index - 1;
                    } else {
                        b.order = index;
                    }
                }
                return b;
            });
        } else {
            return;
        }

        cmapFetch('button/order', {
            method: 'POST',
            body: JSON.stringify(newButtonOrder),
            headers: {
                'Content-Type': 'application/json'
            }
        }, (data, res) => {
            if (res.code === 200) {
                avatarDataDispatch({ type: 'setButtonOrder', buttons: newButtonOrder, avatarId: avatar.id!, layoutId: layout.id! });
            }
        });
    }

    return (<ContentBox key={layout.id} flexBasis={layout.width}>

        {!layout.id && <h2 style={{ marginTop: '0' }}>Add new layout</h2>}

        {layout.id && <>
            <FloatIconButton role={'edit'} size={'small'} onClick={() => setEditing(!inEdit)} active={inEdit} />
            <h2 style={{ marginTop: '0' }}>{layout.label}</h2>
        </>}

        {/* Edit layout order */}
        {inEdit && changeOrder && <OrderEditBarStyled>
            <IconButton role={'normal'} size={'small'} icon={'ri-arrow-left-s-line'} disabled={layout.order - 1 < 0} onClick={() => {
                changeOrder(layout, -1);
                setEditing(false);
            }} />
            Order
            <IconButton role={'normal'} size={'small'} icon={'ri-arrow-right-s-line'} disabled={layout.order + 1 >= buttons.length} onClick={() => {
                changeOrder(layout, 1);
                setEditing(false);
            }} />
        </OrderEditBarStyled>}

        {/* Edit form */}
        {inEdit && <LayoutFormComponent layout={layout} order={order} avatarId={avatar.id!} interactionKeys={interactionKeys}
                                        avatarDataDispatch={avatarDataDispatch} />}

        {/* Buttons */}
        {layout.id && <>
            {/* clear: both becuase of floating edit button */}
            <div style={{ clear: 'both' }} />
            <hr />
            <ButtonsWrapper>
                {buttons.map((button: ButtonDTO, index) => (
                    <div key={button.id} style={{ breakInside: 'avoid-column' }}>
                        {/* Edit bar for buttons */}
                        {inEdit && <OrderEditBarStyled>
                            <IconButton role={'normal'} size={'small'} icon={'ri-arrow-left-s-line'} onClick={() => reorderButtons(button, -1)}
                                        disabled={index - 1 < 0} />
                            Order
                            <IconButton role={'normal'} size={'small'} icon={'ri-arrow-right-s-line'} onClick={() => reorderButtons(button, 1)}
                                        disabled={index + 1 >= buttons.length} />
                        </OrderEditBarStyled>}

                        {/* Buttons */}
                        <ParameterButton button={button} buttonStyle={buttonStyle}
                                         onClick={() => navigate('/website/avatars/' + avatar.id + '/' + layout.id + '/' + button.id)} />

                    </div>))}
                {(clientTier.buttons && buttons.length < clientTier.buttons) &&
                    <AddNewButton onClick={() => navigate('/website/avatars/' + avatar.id + '/' + layout.id + '/new')} />}
            </ButtonsWrapper>
        </>}
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

const OrderEditBarStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
