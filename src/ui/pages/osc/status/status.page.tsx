import { Page } from '../../../components/page/page.component';
import GameStatus from './gameStatus/gameStatus.component';
import OscStatus from './oscStatus/oscStatus.component';

export default function StatusPage() {

  return (<Page flexDirection={'column'}>
    <GameStatus />
    <OscStatus />
  </Page>);
}
