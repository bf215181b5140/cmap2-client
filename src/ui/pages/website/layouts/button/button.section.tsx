import { useState } from 'react';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import { ButtonSectionEvents } from './button.model';
import Section from '../../../../components/section/section.component';
import ButtonPreview from './preview/buttonPreview.component';
import ButtonImageForm from './imageForm/buttonImageForm.component';
import ButtonForm from './form/buttonForm.component';

export default function ButtonSection() {

  const [buttonSectionEvents] = useState(new EventEmitter() as TypedEmitter<ButtonSectionEvents>);

  return (<Section direction={'row'}>

    <Section direction={'row'} style={{ minWidth: '300px', flex: 1, height: 'min-content' }}>
      <ButtonPreview buttonSectionEvents={buttonSectionEvents} />
      <ButtonImageForm buttonSectionEvents={buttonSectionEvents} />
    </Section>

    <ButtonForm buttonSectionEvents={buttonSectionEvents} />

  </Section>);
}