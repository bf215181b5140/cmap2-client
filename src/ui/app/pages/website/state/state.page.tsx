import Content from '../../../shared/components/contentBox/content.component';
import ParametersState from './parametersState/parametersState.component';
import ParameterEditForm from './parametersState/components/parameterEditForm.component';
import React from 'react';

export default function StatePage() {

    return (<Content flexDirection={'row'}>
        <ParametersState />

        <ParameterEditForm parameter={''} />
    </Content>);
}
