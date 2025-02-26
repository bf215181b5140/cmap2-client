import ConnectionBox from './launchPadBox.component';
import useGameDetector from '../../../hooks/gameDetector.hook';
import useOscActivity from '../../../hooks/oscActivity.hook';

export default function VrcConnection() {

  const { gamesDetectedText, gamesDetectedColor, gameDetectionIcon } = useGameDetector();
  const { oscActivityText, oscActivityColor } = useOscActivity();

  return (<ConnectionBox icon={gameDetectionIcon} redirectPath={'/osc'}>
    <h1>Games</h1>
    <h2 style={{ color: gamesDetectedColor }}>{gamesDetectedText}</h2>
    <h2 style={{ color: oscActivityColor }}>{oscActivityText}</h2>
  </ConnectionBox>);
}


