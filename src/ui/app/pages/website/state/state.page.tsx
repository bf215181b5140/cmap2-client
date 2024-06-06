import Content from '../../../shared/components/contentBox/content.component';
import ParametersState from './parametersState/parametersState.component';
import ParameterEditForm from './parametersState/components/parameterEditForm.component';
import React, { useEffect, useRef, useState } from 'react';
import { EventEmitter } from 'events';
import { ClientStateParamsDTO } from 'cmap2-shared';

export default function StatePage() {

    const [statePageEmitter] = useState(new EventEmitter());

    return (<Content flexDirection={'row'}>
        <ParametersState statePageEmitter={statePageEmitter} />

        <ParameterEditForm statePageEmitter={statePageEmitter} />
    </Content>);
}
