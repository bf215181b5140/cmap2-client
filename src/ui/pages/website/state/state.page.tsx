import React, { useState } from 'react';
import { EventEmitter } from 'events';
import { Page } from '../../../components/page/page.component';
import ParametersState from './parametersState/parametersState.component';
import ParameterEditForm from './parametersState/components/parameterEditForm.component';

export default function StatePage() {

    const [statePageEmitter] = useState(new EventEmitter());

    return (<Page>
        <ParametersState statePageEmitter={statePageEmitter} />

        <ParameterEditForm statePageEmitter={statePageEmitter} />
    </Page>);
}
