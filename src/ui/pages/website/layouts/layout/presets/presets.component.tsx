import Segment from '../../../../../components/segment/segment.component';
import { LayoutButtonWrapper, PresetButtonComponent } from 'cmap-shared/react';
import { LayoutDTO, PresetButtonDTO } from 'cmap-shared';
import { useContext } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import AddCounter from '../../../../../components/addCounter/addCounter.component';
import { useNavigate } from 'react-router-dom';
import AddNewButton from '../../../../../components/addNewButton/addNewButton.component';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../hooks/useNotifications.hook';
import useDragItems from '../../../../../hooks/dragItems.hook';

interface PresetsProps {
  layout: LayoutDTO;
}

export default function Presets({ layout }: PresetsProps) {

  const navigate = useNavigate();
  const { tier, theme, layoutsDispatch } = useContext(LayoutsPageContext);
  const { POST } = useCmapFetch();
  const { addNotification } = useNotifications();
  const dragProps = useDragItems<PresetButtonDTO>();

  const canAddPreset = (layout.presetButtons?.length || 0) < tier.presetButtons;

  function onOrderChange(item: PresetButtonDTO, replacingItem: PresetButtonDTO) {
    const oldPosition = item.order;
    const newPosition = replacingItem.order;
    const minPosition = Math.min(oldPosition, newPosition);
    const maxPosition = Math.max(oldPosition, newPosition);
    const betweenChange = oldPosition < newPosition ? -1 : 1;

    const newPresetButtons = layout.presetButtons?.map(pb => {
      // item that changes
      if (pb.id === item.id) return { ...pb, order: newPosition };
      // item that gets position taken
      if (pb.id === replacingItem.id) return { ...pb, order: pb.order + betweenChange };
      // items in between
      if (pb.order > minPosition && pb.order < maxPosition) return { ...pb, order: pb.order + betweenChange };
      // unaffected items
      return pb;
    })?.sort((a, b) => a.order - b.order);

    if (!newPresetButtons) return;

    POST('layouts/presetButton/order', newPresetButtons.map(pb => ({ id: pb.id, order: pb.order })), undefined, () => {
      layoutsDispatch({ type: 'setPresetButtonOrder', layoutId: layout.id, presetButtons: newPresetButtons });
      addNotification('Success', 'Preset order saved.');
    });
  }

  return (<Segment segmentTitle={'Presets'}>
    <LayoutButtonWrapper>
      {layout.presetButtons?.map(preset => <PresetButtonComponent key={preset.id} theme={theme} presetButton={preset}
                                                                  {...dragProps(preset, onOrderChange)}
                                                                  onClick={() => navigate(`/website/layouts/edit/presetButton/${layout.id}/${preset.id}`)} />)}

      <AddNewButton onClick={() => navigate(`/website/layouts/edit/presetButton/${layout.id}/new`)} aria-disabled={!canAddPreset}>
        <AddCounter canAddMore={canAddPreset}>{layout.presetButtons?.length || 0}/{tier.presetButtons}</AddCounter>
        {canAddPreset ? 'Add preset' : 'Limit reached'}
      </AddNewButton>

    </LayoutButtonWrapper>
  </Segment>);
}
