import React, { useState } from 'react';
import { EventEmitter } from 'events';
import { Page } from '../../../components/page/page.component';

export default function StatePage() {

    const [statePageEmitter] = useState(new EventEmitter());

    return (<Page>
        {/* <ParametersState statePageEmitter={statePageEmitter} /> */}

        {/* <ParameterEditForm statePageEmitter={statePageEmitter} /> */}
    </Page>);
}
