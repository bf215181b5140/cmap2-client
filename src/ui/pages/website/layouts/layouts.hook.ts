import { useParams } from 'react-router-dom';
import { ButtonDTO, ButtonFormDTO, GroupDTO, GroupFormDTO, LayoutDTO, LayoutFormDTO, LayoutsPageDTO, LayoutsPageSchema } from 'cmap2-shared';
import { useEffect, useReducer, useState } from 'react';
import layoutsReducer from './layouts.reducer';
import useCmapFetch from '../../../hooks/cmapFetch.hook';

export function useLayoutsPage() {

  const { layoutId, groupId, buttonId } = useParams();
  const { GET } = useCmapFetch();
  const [client, setClient] = useState<LayoutsPageDTO | undefined>();
  const [layouts, layoutsDispatch] = useReducer(layoutsReducer, client?.layouts || []);

  useEffect(() => {
    GET('layouts', LayoutsPageSchema, (data) => {
      setClient(data);
      layoutsDispatch({ type: 'setLayouts', layouts: data.layouts });
    });
  }, []);

  const layout = layouts?.find(l => l.id === layoutId);
  const group = layout?.groups?.find(g => g.id === groupId);
  const button = group?.buttons?.find(b => b.id === buttonId);

  const section = button || buttonId === 'new' ? 'button' : group || groupId === 'new' ? 'group' : layout || layoutId === 'new' ? 'layout' : 'layouts';

  const newGroup: GroupFormDTO = {
    id: null,
    layoutId: '',
    label: '',
    order: layout?.groups?.length || 1,
    width: 'Full',
    visibilityParameters: [],
    interactionKeyId: null,
  };

  const newButton: ButtonFormDTO = {
    id: null,
    groupId: '',
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

  return { client, layouts, layoutsDispatch, section, layout, group, button, layoutId, groupId, buttonId };
}