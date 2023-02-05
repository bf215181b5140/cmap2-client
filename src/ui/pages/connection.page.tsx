import { useContext, useEffect, useState } from 'react';
import { ClientCredentials } from 'cmap2-shared/clientCredentials';
import { ClientCredentialsContext, ConnectionStatusContext } from '../App';
import useConnectionIcon from '../hooks/connectionIcon.hook';
import styled from 'styled-components';
import Input from "../components/form/input.component";
import ActionButton from "../components/buttons/action.button";

export default function ConnectionPage() {

    // connection status
    const clientCredentials = useContext(ClientCredentialsContext);
    const connection = useContext(ConnectionStatusContext);
    const connectionIcon = useConnectionIcon(connection);

    // Client credentials
    const [credentialsForm, setCredentialsForm] = useState<ClientCredentials>(new ClientCredentials());

    useEffect(() => {
        setCredentialsForm(clientCredentials);
        console.log('ConnectionPage useEffect [clientCredentials]')
    }, [clientCredentials])

    function usernameOnChange(value: string) {
        setCredentialsForm({
            password: credentialsForm.password,
            username: value,
            serverUrl: clientCredentials.serverUrl
        });
    }

    function passwordOnChange(value: string) {
        setCredentialsForm({
            password: value,
            username: credentialsForm.username,
            serverUrl: clientCredentials.serverUrl
        });
    }

    function sendClientCredentials() {
        window.electronAPI.setClientCredentials(credentialsForm);
    }

    function clearClientCredentials() {
        window.electronAPI.setClientCredentials(new ClientCredentials());
    }

    return (<HomePageStyled>
        <h1>{connection.message}</h1>
        <h3>{connection.description}</h3>
        <i className={connectionIcon.type} style={{
            color: connectionIcon.color,
            fontSize: '6em',
            margin: '20px'
        }} />

        <Input inputName="username" inputType="text" inputValue={credentialsForm.username} inputOnChange={(event: any) => usernameOnChange(event.target.value)} />
        <Input inputName="password" inputType="password" inputValue={credentialsForm.password} inputOnChange={(event: any) => passwordOnChange(event.target.value)} />
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
