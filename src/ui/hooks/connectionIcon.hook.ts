import colors from '../style/colors.json';
import { SocketConnectionStatus, SocketConnectionStatusCode } from '../../shared/SocketConnectionStatus';

export default function useConnectionIcon(connectionStatus: SocketConnectionStatus) {

    let type: string = '';
    let color: string = '';

    switch(connectionStatus.code) {
        case SocketConnectionStatusCode.NO_CREDENTIALS:
            type = 'ri-loader-fill';
            color = colors['text-1'];
            break;
        case SocketConnectionStatusCode.CONNECTED:
            type = 'ri-wifi-fill';
            color = colors['success'];
            break;
        case SocketConnectionStatusCode.DISCONNECTED:
            type = 'ri-wifi-off-fill';
            color = colors['warning'];
            break;
        case SocketConnectionStatusCode.CONNECTING:
        case SocketConnectionStatusCode.AUTHENTICATING:
            type = 'ri-wifi-fill';
            color = colors['info'];
            break;
        case SocketConnectionStatusCode.ERROR:
        case SocketConnectionStatusCode.AUTHENTICATION_FAILED:
            type = 'ri-wifi-off-fill';
            color = colors['error'];
            break;
    }

    return {type, color};
}
