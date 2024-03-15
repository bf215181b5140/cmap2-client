import { SocketConnection, SocketConnectionType } from '../../../../shared/SocketConnection';
import { theme } from 'cmap2-shared';

export default function useConnectionIcon(connectionStatus: SocketConnection) {

    let type: string = '';
    let color: string = '';

    switch(connectionStatus.type) {
        case SocketConnectionType.SUCCESS:
            type = 'ri-wifi-fill';
            color = theme.colors.success;
            break;
        case SocketConnectionType.MESSAGE:
            type = 'ri-wifi-line';
            color = theme.colors.info;
            break;
        case SocketConnectionType.ERROR:
            type = 'ri-wifi-off-fill';
            color = theme.colors.error;
            break;
    }

    return {type, color};
}
