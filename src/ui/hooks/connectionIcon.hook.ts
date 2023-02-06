import colors from '../style/colors.json';
import { ConnectionStatus, ConnectionStatusCode } from '../../shared/ConnectionStatus';

export default function useConnectionIcon(connectionStatus: ConnectionStatus) {

    let type: string = '';
    let color: string = '';

    switch(connectionStatus.code) {
        case ConnectionStatusCode.NO_CREDENTIALS:
            type = 'ri-loader-fill';
            color = colors['text-1'];
            break;
        case ConnectionStatusCode.CONNECTED:
            type = 'ri-wifi-fill';
            color = colors['success'];
            break;
        case ConnectionStatusCode.DISCONNECTED:
            type = 'ri-wifi-off-fill';
            color = colors['warning'];
            break;
        case ConnectionStatusCode.CONNECTING:
        case ConnectionStatusCode.AUTHENTICATING:
            type = 'ri-wifi-fill';
            color = colors['info'];
            break;
        case ConnectionStatusCode.ERROR:
        case ConnectionStatusCode.AUTHENTICATION_FAILED:
            type = 'ri-wifi-off-fill';
            color = colors['error'];
            break;
    }

    return {type, color};
}
