import { useParams } from 'react-router-dom';
import { ButtonDTO, GroupDTO, LayoutDTO, LayoutsPageDTO } from 'cmap2-shared';
import { useReducer } from 'react';
import layoutsReducer from './layouts.reducer';

export function useLayoutsPage(client: LayoutsPageDTO) {

  const { layoutId, groupId, buttonId } = useParams();
  const [layouts, layoutsDispatch] = useReducer(layoutsReducer, client.layouts);

  const layout = layouts?.find(l => l.id === layoutId);
  const group = layout?.groups?.find(g => g.id === groupId);
  const button = group?.buttons?.find(b => b.id === buttonId);

  const section = button || buttonId === 'new' ? 'button' : group || groupId === 'new' ? 'group' : layout || layoutId === 'new' ? 'layout' : 'layouts';

  const newLayout: LayoutDTO = {
    id: '',
    label: '',
    avatars: [],
    healthEnabled: false,
    healthMax: null,
    healthPath: null,
    useCostEnabled: false,
    useCostMax: null,
    useCostPath: null
  };

  const newGroup: GroupDTO = {
    id: '',
    label: '',
    order: layout?.groups?.length || 1,
    width: 'Full',
    visibilityParameters: [],
    interactionKeyId: null,
  };

  const newButton: ButtonDTO = {
    id: '',
    label: '',
    path: '',
    value: '',
    valueAlt: '',
    buttonType: 'Button',
    imageOrientation: 'Horizontal',
    order: group?.buttons?.length || 1,
    useCost: null,
    callbackParameters: [],
    visibilityParameters: [],
    interactionKeyId: null,
  };

  return { client, layouts, layoutsDispatch, section, layout, group, button, layoutId, groupId, buttonId, newLayout, newGroup, newButton };
}