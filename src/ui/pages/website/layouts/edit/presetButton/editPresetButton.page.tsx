import { useState } from 'react';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import Section from '../../../../../components/section/section.component';
import { EditPresetButtonEvents } from './editPresetButton.model';
import useEditPageItems from '../hooks/editPageItems.hook';
import { Page } from '../../../../../components/page/page.component';
import EditPageMenu from '../menu/editPageMenu.component';
import PresetButtonPreview from './preview/presetButtonPreview.component';
import PresetButtonImageForm from './imageForm/presetButtonImageForm.component';
import PresetButtonForm from './form/presetButtonForm.component';

export default function EditPresetButtonPage() {

  const { layout, presetButton } = useEditPageItems();
  const [presetButtonEvents] = useState(new EventEmitter() as TypedEmitter<EditPresetButtonEvents>);

  if (!layout) return;

  return (<Page flexDirection={'row'}>

    <EditPageMenu />

    <Section direction={'column'} style={{ minWidth: '300px', flex: 1, height: 'min-content' }}>
      <PresetButtonPreview presetButtonEvents={presetButtonEvents} presetButton={presetButton} />
      <PresetButtonImageForm presetButtonEvents={presetButtonEvents} layout={layout} presetButton={presetButton} />
    </Section>

    <PresetButtonForm presetButtonEvents={presetButtonEvents} layout={layout} presetButton={presetButton} />

  </Page>);
}