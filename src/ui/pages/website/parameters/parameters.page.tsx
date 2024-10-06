import React, { useState } from 'react';
import { EventEmitter } from 'events';
import { Page } from '../../../components/page/page.component';
import TrackedParameters from './trackedParameters/trackedParameters.component';
import ParameterEdit from './parameterEdit/parameterEdit.component';
import TypedEmitter from 'typed-emitter/rxjs';
import { ParametersPageEmitter } from './types/parametersPageEmitter';

export default function ParametersPage() {

    const [parametersPageEmitter] = useState(new EventEmitter() as TypedEmitter<ParametersPageEmitter>);

    return (<Page>
        <TrackedParameters parametersPageEmitter={parametersPageEmitter} />
        <ParameterEdit parametersPageEmitter={parametersPageEmitter} />
    </Page>);
}
