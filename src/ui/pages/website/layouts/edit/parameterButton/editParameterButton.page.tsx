import { useState } from 'react';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import { EditParameterButtonEvents } from './editParameterButton.model';
import Section from '../../../../../components/section/section.component';
import ParameterButtonPreview from './preview/parameterButtonPreview.component';
import ParameterButtonImageForm from './imageForm/parameterButtonImageForm.component';
import ParameterButtonForm from './form/parameterButtonForm.component';
import useEditPageItems from '../hooks/editPageItems.hook';
import { Page } from '../../../../../components/page/page.component';
import EditPageMenu from '../menu/editPageMenu.component';

export default function EditParameterButtonPage() {

  const { layout, group, parameterButton } = useEditPageItems();
  const [parameterButtonEvents] = useState(new EventEmitter() as TypedEmitter<EditParameterButtonEvents>);

  if (!layout || !group) return;

  return (<Page flexDirection={'row'}>

    <EditPageMenu />

    <Section direction={'column'} style={{ minWidth: '300px', flex: 1, height: 'min-content' }}>
      <ParameterButtonPreview parameterButtonEvents={parameterButtonEvents} parameterButton={parameterButton} />
      <ParameterButtonImageForm parameterButtonEvents={parameterButtonEvents} layout={layout} group={group} parameterButton={parameterButton} />
    </Section>

    <ParameterButtonForm parameterButtonEvents={parameterButtonEvents} layout={layout} group={group} parameterButton={parameterButton} />

  </Page>);
}