import { useNavigate } from 'react-router-dom';
import { MouseEvent, useContext } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import { GroupDTO, LayoutDTO, ParameterButtonDTO } from 'cmap-shared';
import { Layout, LayoutButtonComponent, LayoutGroup } from 'cmap-shared/react';
import AddCounter from '../../../../../components/addCounter/addCounter.component';
import styled from 'styled-components';
import AddNewButton from '../../../../../components/addNewButton/addNewButton.component';
import useDragItems from '../../../../../hooks/dragItems.hook';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../hooks/useNotifications.hook';

interface ParameterProps {
  layout: LayoutDTO;
}

export default function Parameters({ layout }: ParameterProps) {

  const navigate = useNavigate();
  const { tier, theme, layoutsDispatch } = useContext(LayoutsPageContext);
  const { POST } = useCmapFetch();
  const { addNotification } = useNotifications();
  const groupDragProps = useDragItems<GroupDTO>();
  const parameterButtonDragProps = useDragItems<ParameterButtonDTO>();

  function canAddGroup(layout: LayoutDTO) {
    return (layout.groups?.length || 0) < tier.groups;
  }

  function canAddParameterButton(group: GroupDTO) {
    return (group.parameterButtons?.length || 0) < tier.parameterButtons;
  }

  function onClick(event: MouseEvent<HTMLDivElement>, to: string) {
    event.stopPropagation();
    navigate(to);
  }

  function onGroupOrderChange(item: GroupDTO, replacingItem: GroupDTO) {
    const oldPosition = item.order;
    const newPosition = replacingItem.order;
    const minPosition = Math.min(oldPosition, newPosition);
    const maxPosition = Math.max(oldPosition, newPosition);
    const betweenChange = oldPosition < newPosition ? -1 : 1;

    const newGroups = layout.groups?.map(g => {
      // item that changes
      if (g.id === item.id) return { ...g, order: newPosition };
      // item that gets position taken
      if (g.id === replacingItem.id) return { ...g, order: g.order + betweenChange };
      // items in between
      if (g.order > minPosition && g.order < maxPosition) return { ...g, order: g.order + betweenChange };
      // unaffected items
      return g;
    })?.sort((a, b) => a.order - b.order);

    if (!newGroups) return;

    POST('layouts/group/order', newGroups.map(g => ({ id: g.id, order: g.order })), undefined, () => {
      layoutsDispatch({ type: 'setGroupOrder', layoutId: layout.id, groups: newGroups });
      addNotification('Success', 'Group order saved.');
    });
  }

  function onParameterButtonOrderChange(item: ParameterButtonDTO, replacingItem: ParameterButtonDTO, group: GroupDTO) {
    // if either of drag items aren't in this group then dismiss event
    if (!group.parameterButtons?.find(b => b.id === item.id) || !group.parameterButtons?.find(b => b.id === replacingItem.id)) return;

    const oldPosition = item.order;
    const newPosition = replacingItem.order;
    const minPosition = Math.min(oldPosition, newPosition);
    const maxPosition = Math.max(oldPosition, newPosition);
    const betweenChange = oldPosition < newPosition ? -1 : 1;

    const newParameterButtons = group.parameterButtons?.map(pb => {
      // item that changes
      if (pb.id === item.id) return { ...pb, order: newPosition };
      // item that gets position taken
      if (pb.id === replacingItem.id) return { ...pb, order: pb.order + betweenChange };
      // items in between
      if (pb.order > minPosition && pb.order < maxPosition) return { ...pb, order: pb.order + betweenChange };
      // unaffected items
      return pb;
    })?.sort((a, b) => a.order - b.order);

    if (!newParameterButtons) return;

    POST('layouts/parameterButton/order', newParameterButtons.map(pb => ({ id: pb.id, order: pb.order })), undefined, () => {
      layoutsDispatch({ type: 'setParameterButtonOrder', layoutId: layout.id, groupId: group.id, parameterButtons: newParameterButtons });
      addNotification('Success', 'Button order saved.');
    });
  }

  return (<ParametersSectionStyled>

    {/* Groups */}
    {layout.groups?.map(group => (
      <LayoutGroup key={group.id} theme={theme} group={group}
                   {...groupDragProps(group, onGroupOrderChange)}
                   onClick={event => onClick(event, `/website/layouts/edit/group/${layout.id}/${group.id}`)}>

        {/* Parameter Buttons */}
        {group.parameterButtons?.map(parameterButton => (
          <LayoutButtonComponent key={parameterButton.id} theme={theme} parameterButton={parameterButton}
                                 {...parameterButtonDragProps(parameterButton, (item, replacingItem) => onParameterButtonOrderChange(item, replacingItem, group))}
                                 onClick={event => onClick(event, `/website/layouts/edit/parameterButton/${layout.id}/${group.id}/${parameterButton.id}`)} />
        ))}

        {/* Add Parameter Button */}
        <AddNewButton onClick={event => onClick(event, `/website/layouts/edit/parameterButton/${layout.id}/${group.id}/new`)} aria-disabled={!canAddParameterButton(group)}>
          <AddCounter canAddMore={canAddParameterButton(group)}>{group.parameterButtons?.length || 0}/{tier.parameterButtons}</AddCounter>
          {canAddParameterButton(group) ? 'Add parameter button' : 'Limit reached'}
        </AddNewButton>

      </LayoutGroup>
    ))}

    {/* Add Group */}
    <AddNewButton onClick={event => onClick(event, `/website/layouts/edit/group/${layout.id}/new`)} aria-disabled={!canAddGroup(layout)}>
      <i className={'ri-function-add-fill'} />
      <AddCounter canAddMore={canAddGroup(layout)}>{layout.groups?.length || 0}/{tier.groups}</AddCounter>
      {canAddGroup(layout) ? 'Add group' : 'Limit reached'}
    </AddNewButton>

  </ParametersSectionStyled>);
}

const ParametersSectionStyled = styled(Layout)`
  padding: 0;
`;
