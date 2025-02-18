import { useContext, useState } from 'react';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import Section from '../../../../../components/section/section.component';
import { PresetsSectionEvents } from './presets.model';
import { PresetDTO } from 'cmap2-shared';
import { LayoutsPageContext } from '../../layouts.context';
import PresetPreview from './preview/presetPreview.component';
import PresetImageForm from './imageForm/presetImageForm.component';
import PresetForm from './form/presetForm.component';
import Presets from './presets/presets.component';

export default function PresetsSection() {

  const { layoutId, layout } = useContext(LayoutsPageContext);

  const [selectedPreset, setSelectedPreset] = useState<PresetDTO | undefined>();
  const [presetSectionEvents] = useState(new EventEmitter() as TypedEmitter<PresetsSectionEvents>);

  return (<>

    <Presets selectedPreset={selectedPreset} setSelectedPreset={setSelectedPreset} />

    {selectedPreset && <Section direction={'row'}>
      <Section direction={'column'} style={{ minWidth: '300px', flex: 1, height: 'min-content' }}>
        <PresetPreview presetSectionEvents={presetSectionEvents} preset={selectedPreset} />
        <PresetImageForm presetSectionEvents={presetSectionEvents} preset={selectedPreset} />
      </Section>

      <PresetForm presetSectionEvents={presetSectionEvents} preset={selectedPreset} setSelectedPreset={setSelectedPreset} />
    </Section>}

  </>);
}