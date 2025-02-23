import Segment from '../../../../../../components/segment/segment.component';
import { LayoutButtonWrapper, PresetButtonComponent } from 'cmap2-shared/react';
import { ImageOrientationSchema, PresetButtonDTO } from 'cmap2-shared';
import { Dispatch, SetStateAction, useContext } from 'react';
import { LayoutsPageContext } from '../../../layouts.context';
import AddCounter from '../../../../../../components/addCounter/addCounter.component';
import styled from 'styled-components';

interface PresetsProps {
  selectedPreset: PresetButtonDTO | undefined;
  setSelectedPreset: Dispatch<SetStateAction<PresetButtonDTO | undefined>>;
}

export default function Presets({ selectedPreset, setSelectedPreset }: PresetsProps) {

  const { tier, theme, layout } = useContext(LayoutsPageContext);

  function onPresetClick(preset: PresetButtonDTO) {
    if (preset.id === selectedPreset?.id) {
      setSelectedPreset(undefined);
    } else {
      setSelectedPreset(preset);
    }
  }

  function onSetNewPreset() {
    const newPreset: PresetButtonDTO = {
      id: '',
      label: '',
      parameters: [],
      imageOrientation: ImageOrientationSchema.Enum.Square,
      order: (layout?.presetButtons?.length ?? 0) + 1,
      useCost: null,
      callbackParameters: [],
      visibilityParameters: [],
      interactionKeyId: null,
    };
    setSelectedPreset(newPreset);
  }

  const canAddPreset = (layout?.presetButtons?.length || 0) < tier.presetButtons;

  return (<Segment segmentTitle={'Presets'}>
    <LayoutButtonWrapper>
      {layout?.presetButtons?.map(preset => <PresetButtonComponent key={preset.id} theme={theme} presetButton={preset} onClick={() => onPresetClick(preset)} />)}

      <NewItemStyled onClick={onSetNewPreset} aria-disabled={!canAddPreset}>
        {/* <i className={'ri-function-add-fill'} /> */}
        <AddCounter canAddMore={canAddPreset}>{layout?.presetButtons?.length || 0}/{tier.presetButtons}</AddCounter>
        {canAddPreset ? 'Add preset' : 'Limit reached'}
      </NewItemStyled>

    </LayoutButtonWrapper>
  </Segment>);
}

const NewItemStyled = styled.div`
  border: 2px dashed ${props => props.theme.colors.ui.element2};
  padding: 30px;
  border-radius: 8px;
  flex: 100%;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: 0.1s linear;
  pointer-events: auto;

  i {
    color: ${props => props.theme.colors.success};
    position: absolute;
    top: 24px;
    right: 30px;
    font-size: 30px;
  }

  :hover {
    border-color: ${props => props.theme.colors.ui.element5};

    > i {
      color: ${props => props.theme.colors.ui.element5};
    }
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    border: none;
    padding: 10px;

    > i {
      display: none;
    }
  }
`;
