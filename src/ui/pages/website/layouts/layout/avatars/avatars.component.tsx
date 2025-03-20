import { useContext } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import { AvatarButtonComponent, LayoutButtonWrapper } from 'cmap-shared/react';
import AddCounter from '../../../../../components/addCounter/addCounter.component';
import Segment from '../../../../../components/segment/segment.component';
import { useNavigate } from 'react-router-dom';
import AddNewButton from '../../../../../components/addNewButton/addNewButton.component';
import { AvatarButtonDTO } from 'cmap-shared';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../hooks/useNotifications.hook';
import useDragItems from '../../../../../hooks/dragItems.hook';

export default function Avatars() {

  const navigate = useNavigate();
  const { theme, tier, avatarButtons, avatarButtonsDispatch } = useContext(LayoutsPageContext);
  const { POST } = useCmapFetch();
  const { addNotification } = useNotifications();
  const dragProps = useDragItems<AvatarButtonDTO>();

  const canAddAvatar = (avatarButtons.length || 0) < tier.avatarButtons;

  function onOrderChange(item: AvatarButtonDTO, replacingItem: AvatarButtonDTO) {
    const oldPosition = item.order;
    const newPosition = replacingItem.order;
    const minPosition = Math.min(oldPosition, newPosition);
    const maxPosition = Math.max(oldPosition, newPosition);
    const betweenChange = oldPosition < newPosition ? -1 : 1;

    const newAvatarButtons = avatarButtons?.map(ab => {
      // item that changes
      if (ab.id === item.id) return { ...ab, order: newPosition };
      // item that gets position taken
      if (ab.id === replacingItem.id) return { ...ab, order: ab.order + betweenChange };
      // items in between
      if (ab.order > minPosition && ab.order < maxPosition) return { ...ab, order: ab.order + betweenChange };
      // unaffected items
      return ab;
    })?.sort((a, b) => a.order - b.order);

    if (!newAvatarButtons) return;

    POST('layouts/avatarButton/order', newAvatarButtons.map(ab => ({ id: ab.id, order: ab.order })), undefined, () => {
      avatarButtonsDispatch({ type: 'setOrder', avatarButtons: newAvatarButtons });
      addNotification('Success', 'Avatar order saved.');
    });
  }

  return (<Segment segmentTitle={'Avatars'}>
    <LayoutButtonWrapper>
      {avatarButtons.map(avatarButton => <AvatarButtonComponent key={avatarButton.id} theme={theme} avatarButton={avatarButton}
                                                                {...dragProps(avatarButton, onOrderChange)}
                                                                onClick={() => navigate(`/website/layouts/edit/avatarButton/${avatarButton.id}`)} />)}

      <AddNewButton onClick={() => navigate(`/website/layouts/edit/avatarButton/new`)} aria-disabled={!canAddAvatar}>
        <AddCounter canAddMore={canAddAvatar}>{avatarButtons.length}/{tier.avatarButtons}</AddCounter>
        {canAddAvatar ? 'Add avatar' : 'Limit reached'}
      </AddNewButton>

    </LayoutButtonWrapper>
  </Segment>);
}

