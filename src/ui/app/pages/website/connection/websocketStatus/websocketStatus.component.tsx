import { useContext, useEffect, useRef, useState } from 'react';
import { ContentBox } from 'cmap2-shared/dist/react/';
import CheckboxInput from '../../../../shared/components/form/inputs/checkbox.component';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { SocketConnection, SocketConnectionType } from '../../../../../../shared/SocketConnection';
import { WebsocketSettings, websocketSettingsSchema } from '../../../../../../shared/types/settings';
import useConnectionIcon from '../../../../shared/hooks/connectionIcon.hook';
import FormTable from '../../../../shared/components/form/formTable.component';
import { theme } from 'cmap2-shared';
import { ClientCredentialsContext } from '../../../../App';

export default function WebsocketStatus() {

    const [socketConnection, setSocketConnection] = useState<SocketConnection>(new SocketConnection());
    const connectionIcon = useConnectionIcon(socketConnection);
    const {clientCredentials: {apiToken}} = useContext(ClientCredentialsContext);
    const {register, formState: {errors}, handleSubmit, reset} = useForm<WebsocketSettings>({resolver: zodResolver(websocketSettingsSchema)});
    const submitRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        window.electronAPI.get('getConnectionStatus').then(data => setSocketConnection(data));
        window.electronAPI.get('getWebsocketSettings').then(data => reset(data));

        const removeListener = window.electronAPI.receive('updateConnectionStatus', (data) => setSocketConnection(data));

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    function onConnect() {
        window.electronAPI.send('connectSocket');
    }

    function onDisconnect() {
        window.electronAPI.send('disconnectSocket');
    }

    function onSubmit(data: WebsocketSettings) {
        window.electronAPI.send('setWebsocketSettings', data);
    }

    return (<ContentBox>
        <Header connectionStatus={socketConnection}/>

        {socketConnection.description && <span>{socketConnection.description}</span>}

        <p>When connected, the application will forward OSC messages from VRChat to the website and vice versa.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
            <FormTable>
                <tr>
                    <th>Connect automatically</th>
                    <td><CheckboxInput name={'autoLogin'} register={register} errors={errors} onChange={() => submitRef.current?.click()} /></td>
                </tr>
            </FormTable>
            <input type={'submit'} ref={submitRef} style={{visibility: 'hidden'}} />
        </form>

        {socketConnection.type === SocketConnectionType.SUCCESS ? (
            <ButtonInput text={'Disconnect'} onClick={onDisconnect} />
        ) : (
            <ButtonInput text={'Connect'} onClick={onConnect} disabled={!apiToken} />
        )}
    </ContentBox>);
}

function Header({connectionStatus}: { connectionStatus: SocketConnection }) {
    switch (connectionStatus.type) {
        case SocketConnectionType.SUCCESS:
            return (<h2 style={{color: theme.colors.success}}>Connected to website</h2>);
        case SocketConnectionType.MESSAGE:
            return (<h2 style={{color: theme.colors.error}}>Not connected to website</h2>);
        case SocketConnectionType.ERROR:
            return (<h2 style={{color: theme.colors.error}}>Error connecting to website</h2>);
    }

}

