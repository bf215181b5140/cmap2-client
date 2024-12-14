import ConnectionBox from './launchPadBox.component';
import useVrcDetector from '../../../hooks/vrcDetector.hook';
import useOscActivity from '../../../hooks/oscActivity.hook';

export default function VrcConnection() {

  const { isVrcDetected, vrcStatus, vrcStatusColor } = useVrcDetector();
  const { oscActivityText, oscActivityColor } = useOscActivity();

  return (<ConnectionBox icon={'ri-gamepad-line'} redirectPath={'/osc'}>
    <h1>VRChat</h1>
    <h2 style={{ color: vrcStatusColor }}>{vrcStatus}</h2>
    <h2 style={{ color: oscActivityColor }}>{oscActivityText}</h2>
  </ConnectionBox>);
}


