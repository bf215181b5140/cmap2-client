import { useState } from 'react';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import { ParametersPageEmitter } from './types/parametersPageEmitter';
import { Page } from '../../../components/page/page.component';
import TrackedParameters from './trackedParameters/trackedParameters.component';
import ParameterEdit from './parameterEdit/parameterEdit.component';

export default function ParametersPage() {

  const [parametersPageEmitter] = useState(new EventEmitter() as TypedEmitter<ParametersPageEmitter>);

  return (<Page flexDirection={'column'}>
    <TrackedParameters parametersPageEmitter={parametersPageEmitter} />
    <ParameterEdit parametersPageEmitter={parametersPageEmitter} />
  </Page>);
}
