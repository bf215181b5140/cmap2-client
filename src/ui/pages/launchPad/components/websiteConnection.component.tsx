import ConnectionBox from './launchPadBox.component';
import useSocketConnection from '../../../hooks/socketConnection.hook';

export default function WebsiteConnection() {

  const { connected, message, color } = useSocketConnection();

  return (<ConnectionBox icon={'ri-global-line'} connected={connected} redirectPath={'/website'}>
    <h1>Website</h1>
    <h2 style={{ color: color }}>{message}</h2>
  </ConnectionBox>);
}

