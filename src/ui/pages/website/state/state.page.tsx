import React, { useState } from 'react';
import { EventEmitter } from 'events';
import { Page } from '../../../components/page/page.component';
import ParametersState from './parametersState/parametersState.component';
import ParameterEdit from './parameterEdit/parameterEdit.component';
import TypedEmitter from 'typed-emitter/rxjs';
import { StatePageEmitter } from './types/statePageEmitter';

export default function StatePage() {

    const [statePageEmitter] = useState(new EventEmitter() as TypedEmitter<StatePageEmitter>);

    return (<Page>
        <ParametersState statePageEmitter={statePageEmitter} />

        <ParameterEdit statePageEmitter={statePageEmitter} />
    </Page>);
}
