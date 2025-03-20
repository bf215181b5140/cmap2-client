import { useParams } from 'react-router-dom';
import { useContext, useMemo } from 'react';
import { LayoutsPageContext } from '../../layouts.context';

export default function useEditPageItems() {

  const { layoutId, groupId, parameterButtonId, presetButtonId, avatarButtonId } = useParams();
  const { layouts, avatarButtons } = useContext(LayoutsPageContext);

  const layout = useMemo(() => {
    if (!layoutId || layoutId === 'new') return undefined;
    return layouts?.find(l => l.id === layoutId);
  }, [layoutId, layouts]);

  const group = useMemo(() => {
    if (!layout) return;
    if (!groupId || groupId === 'new') return undefined;
    return layout.groups?.find(g => g.id === groupId);
  }, [groupId, layouts]);

  const parameterButton = useMemo(() => {
    if (!group) return;
    if (!parameterButtonId || parameterButtonId === 'new') return undefined;
    return group.parameterButtons?.find(g => g.id === parameterButtonId);
  }, [parameterButtonId, layouts]);

  const presetButton = useMemo(() => {
    if (!layout) return;
    if (!presetButtonId || presetButtonId === 'new') return undefined;
    return layout.presetButtons?.find(g => g.id === presetButtonId);
  }, [presetButtonId, layouts]);

  const avatarButton = useMemo(() => {
    if (!avatarButtonId || avatarButtonId === 'new') return undefined;
    return avatarButtons?.find(g => g.id === avatarButtonId);
  }, [avatarButtonId, avatarButtons]);

  return { layout, group, parameterButton, presetButton, avatarButton };
}