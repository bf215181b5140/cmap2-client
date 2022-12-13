import { SocketConnectionStatus } from '../../global';
import { SocketConnectionState } from '../../enums';
import colors from '../style/colors.json';

export default function useConnectionIcon(connectionStatus: SocketConnectionStatus) {

    let type: string = '';
    let color: string = '';

    switch(connectionStatus.state) {
        case SocketConnectionState.CONNECTED:
            type = 'ri-wifi-fill';
            color = colors['success'];
            break;
        case SocketConnectionState.DISCONNECTED:
            type = 'ri-wifi-off-fill';
            color = colors['warning'];
            break;
        case SocketConnectionState.CONNECTING:
            type = 'ri-wifi-fill';
            color = colors['info'];
            break;
        case SocketConnectionState.ERROR:
            type = 'ri-wifi-off-fill';
            color = colors['error'];
            break;
    }

    return {type, color};
}
