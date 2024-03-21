import { useEffect, useState } from 'react';
import { WebsocketConnection } from '../../../../shared/webSocket';
import { theme } from 'cmap2-shared';

export default function useWebsocketConnection() {

    const [websocketConnection, setWebsocketConnectionInternal] = useState<WebsocketConnection>(new WebsocketConnection());

    useEffect(() => {
        function setWebsocketConnection(newState: WebsocketConnection) {
            setWebsocketConnectionInternal(state => new WebsocketConnection(newState.status, newState.message));
        }
        window.electronAPI.get('getConnectionStatus').then(data => setWebsocketConnection(data));

        const removeListener = window.electronAPI.receive('updateConnectionStatus', (data) => setWebsocketConnection(data));

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    function websocketConnectionColor(): string {
        switch (websocketConnection.status) {
            case 'Connected':
                return theme.colors.success;
            case 'Connecting':
                return theme.colors.warning;
            case 'Not connected':
                return theme.colors.error;
        }
    }

    return {websocketConnection, websocketConnectionColor: websocketConnectionColor()};
}
