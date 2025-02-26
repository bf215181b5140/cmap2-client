import { Page } from '../../../components/page/page.component';
import TrackedParameters from '../parameters/trackedParameters/trackedParameters.component';
import ParameterSettings from './parameterSettings/parameterSettings.component';

export default function ParametersPage() {

  return (<Page flexDirection={'row'}>
    <TrackedParameters />
    <ParameterSettings />
  </Page>);
}
