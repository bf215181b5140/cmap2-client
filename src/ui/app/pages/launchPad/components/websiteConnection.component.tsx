import ConnectionBox from './connectionBox.component';
import useWebsocketConnection from '../../../shared/hooks/websocketConnection.hook';

export default function WebsiteConnection() {

    const {websocketConnection, websocketConnectionColor} = useWebsocketConnection();

    return (<ConnectionBox icon={'ri-global-line'} connected={websocketConnection.status === 'Connected'} redirectPath={'/website'}>
        <h1>Website</h1>
        <h2 style={{color: websocketConnectionColor}}>{websocketConnection.status}</h2>
    </ConnectionBox>);
}

