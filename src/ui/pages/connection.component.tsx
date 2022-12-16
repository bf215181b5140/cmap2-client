import { useContext, useEffect, useState } from 'react';
import { ClientCredentials } from '../../global';
import { ConnectionStatusContext } from '../App';
import useConnectionIcon from '../hooks/connectionIcon.hook';
import styled from 'styled-components';
import Input from "../components/form/input.component";
import ActionButton from "../components/buttons/action.button";

export default function ConnectionPage() {

    // connection status
    const connection = useContext(ConnectionStatusContext);
    const connectionIcon = useConnectionIcon(connection);

    // Client credentials
    const [clientCredentials, setClientCredentials] = useState<ClientCredentials>({
        apiKey: '',
        username: ''
    });

    useEffect(() => {
        window.electronAPI.getClientCredentials()
            .then(result => {
                if (result != null) {
                    setClientCredentials(result);
                }
            });
    }, []);

    function usernameOnChange(value: string) {
        setClientCredentials({
            apiKey: clientCredentials.apiKey,
            username: value
        });
    }

    function apiKeyOnChange(value: string) {
        setClientCredentials({
            apiKey: value,
            username: clientCredentials.username
        });
    }

    function sendClientCredentials() {
        window.electronAPI.setClientCredentials(clientCredentials);
    }

    function clearClientCredentials() {
        setClientCredentials({
            apiKey: '',
            username: ''
        });
        window.electronAPI.setClientCredentials({
            apiKey: '',
            username: ''
        });
    }

    return (<HomePageStyled>
        <h1>{connection.message}</h1>
        <h3>{connection.description}</h3>
        <i className={connectionIcon.type} style={{
            color: connectionIcon.color,
            fontSize: '6em',
            margin: '20px'
        }} />

        {/*<input name="username" type="text" value={clientCredentials.username} onChange={(event: any) => usernameOnChange(event.target.value)} />*/}
        {/*<input name="apiKey" type="text" value={clientCredentials.apiKey} onChange={(event: any) => apiKeyOnChange(event.target.value)} />*/}
        <Input inputName="username" inputType="text" inputValue={clientCredentials.username} inputOnChange={(event: any) => usernameOnChange(event.target.value)} />
        <Input inputName="apiKey" inputType="text" inputValue={clientCredentials.apiKey} inputOnChange={(event: any) => apiKeyOnChange(event.target.value)} />
        {/*<button name="setApiKey" onClick={sendClientCredentials}>Connect</button>*/}
        {/*<button name="deleteApiKey" onClick={clearClientCredentials}>Clear</button>*/}
        <div>
            <ActionButton action={sendClientCredentials}>Connect</ActionButton>
            <ActionButton action={clearClientCredentials}>Clear</ActionButton>
        </div>
    </HomePageStyled>);
}

const HomePageStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
