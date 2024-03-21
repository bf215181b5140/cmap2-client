import { useContext, useEffect, useRef, useState } from 'react';
import { ContentBox } from 'cmap2-shared/dist/react/';
import CheckboxInput from '../../../../shared/components/form/inputs/checkbox.component';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { WebsocketSettings, websocketSettingsSchema } from '../../../../../../shared/types/settings';
import FormTable from '../../../../shared/components/form/formTable.component';
import { ClientCredentialsContext } from '../../../../App';
import useWebsocketConnection from '../../../../shared/hooks/websocketConnection.hook';

export default function WebsocketStatus() {

    const {websocketConnection, websocketConnectionColor} = useWebsocketConnection();
    const {clientCredentials: {apiToken}} = useContext(ClientCredentialsContext);
    const {register, formState: {errors}, handleSubmit, reset} = useForm<WebsocketSettings>({resolver: zodResolver(websocketSettingsSchema)});
    const submitRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        window.electronAPI.get('getWebsocketSettings').then(data => reset(data));
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
        <h2 style={{color: websocketConnectionColor}}>{websocketConnection.displayMessage()}</h2>

        {websocketConnection.message && <span>{websocketConnection.message}</span>}

        <p>When connected, the application will forward OSC messages from VRChat to the website and vice versa.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
            <FormTable>
                <tr>
                    <th>Connect automatically</th>
                    <td><CheckboxInput name={'autoLogin'} register={register} errors={errors} onChange={() => submitRef.current?.click()} /></td>
                </tr>
            </FormTable>
            <input type={'submit'} ref={submitRef} style={{display: 'none'}} />
        </form>

        {websocketConnection.status === 'Connected' ? (
            <ButtonInput text={'Disconnect'} onClick={onDisconnect} />
        ) : (
            <ButtonInput text={'Connect'} onClick={onConnect} disabled={!apiToken} />
        )}
    </ContentBox>);
}


