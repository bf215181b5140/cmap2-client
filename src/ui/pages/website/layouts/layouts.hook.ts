import { useParams } from 'react-router-dom';
import { ButtonDTO, GroupDTO, LayoutDTO, LayoutsPageDTO } from 'cmap2-shared';

export function useLayoutsPage(client: LayoutsPageDTO, dispatch: () => void) {

  const { layoutId, groupId, buttonId } = useParams();

  const layout = client?.layouts?.find(l => l.id === layoutId);
  const group = layout?.groups?.find(g => g.id === groupId);
  const button = group?.buttons?.find(b => b.id === buttonId);

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

  return { client, dispatch, layout, group, button, newLayout, newGroup, newButton };
}