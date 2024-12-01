import { QuickEditItem } from './quickEditToolbar.model';
import IconButton from '../../../../../components/buttons/iconButton.component';
import styled from 'styled-components';
import { useContext } from 'react';
import { LayoutsPageContext } from '../../../layouts.context';
import { useNavigate } from 'react-router-dom';
import { ButtonDTO, GroupDTO } from 'cmap2-shared';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { ModalContext } from '../../../../../components/context/modal.context';
import GroupCopyModal from './groupCopyModal/groupCopyModal.component';
import ButtonCopyModal from './buttonCopyModal/buttonCopyModal.component';

interface QuickEditToolbarProps {
  item?: QuickEditItem;
}

export default function QuickEditToolbar({ item }: QuickEditToolbarProps) {

  const navigate = useNavigate();
  const { POST, DELETE } = useCmapFetch();
  const { layouts, layoutsDispatch, layout } = useContext(LayoutsPageContext);
  const { setModal } = useContext(ModalContext);
  const itemGroup = layout?.groups?.find(g => g.id === item?.groupId);
  const itemButton = itemGroup?.buttons?.find(b => b.id === item?.buttonId);

  if (!layout) return;

  function onOrderGroup(orderGroup: GroupDTO, change: number) {
    const layoutId = layout?.id;
    const newPosition = orderGroup.order + change;
    const newGroups = layout?.groups?.map(g => {
      if (g.id === orderGroup.id) {
        return { ...g, order: newPosition };
      } else if (g.order === newPosition) {
        return { ...g, order: g.order - change };
      } else {
        return g;
      }
    }).sort((a, b) => a.order - b.order);

    if (!newGroups || !layoutId) return;

    POST('layouts/group/order', newGroups.map(g => ({ id: g.id, order: g.order })), undefined, () => {
      layoutsDispatch({ type: 'setGroupOrder', layoutId, groups: newGroups });
    });
  }

  function onOrderButton(orderButton: ButtonDTO, change: number) {
    const newPosition = orderButton.order + change;
    const newButtons = itemGroup?.buttons?.map(b => {
      if (b.id === orderButton.id) {
        return { ...b, order: newPosition };
      } else if (b.order === newPosition) {
        return { ...b, order: b.order - change };
      } else {
        return b;
      }
    }).sort((a, b) => a.order - b.order);

    const layoutId = layout?.id;
    const groupId = itemGroup?.id;
    if (!newButtons || !layoutId || !groupId) return;

    POST('layouts/button/order', newButtons.map(b => ({ id: b.id, order: b.order })), undefined, () => {
      layoutsDispatch({ type: 'setButtonOrder', layoutId, groupId: groupId, buttons: newButtons });
    });
  }

  function onCopyButton(button: ButtonDTO) {
    setModal(<ButtonCopyModal layouts={layouts} button={button} onSuccess={(layoutId, groupId, button) => layoutsDispatch({ type: 'addButton', layoutId, groupId, button })} />)
  }

  function onCopyGroup(group: GroupDTO) {
    setModal(<GroupCopyModal layouts={layouts} group={group} onSuccess={(layoutId, group) => layoutsDispatch({ type: 'addGroup', layoutId, group })} />)
  }

  function onDeleteGroup(item: GroupDTO) {
    const layoutId = layout?.id;
    const groupId = itemGroup?.id;
    if (!layoutId || !groupId) return;

    DELETE('layouts/group', { id: item.id }, undefined, () => {
      layoutsDispatch({ type: 'removeGroup', layoutId, groupId });
    });
  }

  function onDeleteButton(item: ButtonDTO) {
    const layoutId = layout?.id;
    const groupId = itemGroup?.id;
    const buttonId = item.id;
    if (!layoutId || !groupId || !buttonId) return;

    DELETE('layouts/button', { id: item.id }, undefined, () => {
      layoutsDispatch({ type: 'removeButton', layoutId, groupId, buttonId });
    });
  }

  if (item?.type === 'button' && itemButton) {
    return (<QuickEditToolbarStyled>
      <div>
        <IconButton role={'normal'} icon={'ri-arrow-left-s-line'} disabled={itemButton.order <= 1} onClick={() => onOrderButton(itemButton, -1)} />
        Order: {itemButton.order}
        <IconButton role={'normal'} icon={'ri-arrow-right-s-line'} disabled={itemButton.order >= (itemGroup?.buttons?.length || 1)} onClick={() => onOrderButton(itemButton, 1)} />
      </div>
      <div>
        Selected button: {itemButton.label}
      </div>
      <div>
        <IconButton role={'normal'} size={'small'} tooltip={'Create a copy'} icon={'ri-file-copy-line'} onClick={() => onCopyButton(itemButton)} />
        <IconButton role={'edit'} size={'small'} tooltip={'Detail edit'} onClick={() => navigate(`/layouts/${layout?.id}/${itemGroup?.id}/${itemButton?.id}`)} />
        <hr />
        <IconButton role={'delete'} size={'small'} tooltip={'Delete button'} onClick={() => onDeleteButton(itemButton)} />
      </div>
    </QuickEditToolbarStyled>);

  } else if (item?.type === 'group' && itemGroup) {
    return (<QuickEditToolbarStyled>
      <div>
        <IconButton role={'normal'} icon={'ri-arrow-left-s-line'} disabled={itemGroup.order <= 1} onClick={() => onOrderGroup(itemGroup, -1)} />
        Order: {itemGroup.order}
        <IconButton role={'normal'} icon={'ri-arrow-right-s-line'} disabled={itemGroup.order >= (layout.groups?.length || 1)} onClick={() => onOrderGroup(itemGroup, 1)} />
      </div>
      <div>
        Selected group: {itemGroup.label}
      </div>
      <div>
        <IconButton role={'normal'} size={'small'} tooltip={'Create a copy'}  icon={'ri-file-copy-line'} onClick={() => onCopyGroup(itemGroup)} />
        <IconButton role={'edit'} size={'small'} tooltip={'Detail edit'} onClick={() => navigate(`/layouts/${layout?.id}/${itemGroup?.id}`)} />
        <hr />
        <IconButton role={'delete'} size={'small'} tooltip={'Delete group'} onClick={() => onDeleteGroup(itemGroup)} />
      </div>
    </QuickEditToolbarStyled>);

  } else {
    return (<QuickEditToolbarStyled>
      <div style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
        Click on a group or button to display quick editing options. Double click for detail edit.
      </div>
    </QuickEditToolbarStyled>);
  }
}

const QuickEditToolbarStyled = styled.div`
  background-color: ${props => props.theme.colors.ui.background3};
  border-bottom: 2px solid ${props => props.theme.colors.ui.appBgOpaque};
  border-radius: 0 0 8px 8px;
  padding: 10px;
  margin: 0 -20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  z-index: 2;
  //box-shadow: 0 0 5px black;

  > div {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;

    hr {
      border: 1px solid ${props => props.theme.colors.ui.background5};
      margin: 0;
      height: 30px;
    }
  }
`;