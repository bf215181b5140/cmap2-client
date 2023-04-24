import colors from 'cmap2-shared/src/colors.json';
import { SocketConnection, SocketConnectionType } from '../../../shared/SocketConnection';

export default function useConnectionIcon(connectionStatus: SocketConnection) {

    let type: string = '';
    let color: string = '';

    switch(connectionStatus.type) {
        case SocketConnectionType.SUCCESS:
            type = 'ri-wifi-fill';
            color = colors['success'];
            break;
        case SocketConnectionType.MESSAGE:
            type = 'ri-wifi-line';
            color = colors['info'];
            break;
        case SocketConnectionType.ERROR:
            type = 'ri-wifi-off-fill';
            color = colors['error'];
            break;
    }

    return {type, color};
}
