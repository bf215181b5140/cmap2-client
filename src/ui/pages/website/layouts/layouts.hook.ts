import { useParams } from 'react-router-dom';
import useCmapFetch from '../../../hooks/cmapFetch.hook';
import { useEffect, useReducer, useState } from 'react';
import { LayoutsPageDTO, LayoutsPageSchema } from 'cmap2-shared';
import layoutsReducer from './layouts.reducer';

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
  const button = group?.parameterButtons?.find(b => b.id === buttonId);

  const section = button || buttonId === 'new' ? 'button' : group || groupId === 'new' ? 'group' : layout || layoutId === 'new' ? 'layout' : 'layouts';

  return { client, layouts, layoutsDispatch, section, layout, group, button, layoutId, groupId, buttonId };
}