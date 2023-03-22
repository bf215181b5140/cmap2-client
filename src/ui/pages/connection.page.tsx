import { useContext, useEffect } from 'react';
import { InputType } from 'cmap2-shared';
import { ClientCredentialsContext } from '../App';
import useConnectionIcon from '../hooks/connectionIcon.hook';
import styled from 'styled-components';
import FormInput from '../components/form/formInput.component';
import { SocketConnectionStatus, SocketConnectionStatusCode } from '../../shared/SocketConnectionStatus';
import { ReactProps } from '../../shared/global';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';

interface ConnectionPageProps extends ReactProps {
    socketConnection: SocketConnectionStatus;
}

export default function ConnectionPage(props: ConnectionPageProps) {

    const clientCredentials = useContext(ClientCredentialsContext);
    const connectionIcon = useConnectionIcon(props.socketConnection);

    const {register, setValue, formState: {errors}, handleSubmit} = useForm({
        resolver: zodResolver(z.object({
            serverUrl: z.string().url(),
            username: z.string(),
            password: z.string()
        }))
    });

    useEffect(() => {
        setValue('serverUrl', clientCredentials.serverUrl);
        setValue('username', clientCredentials.username);
        setValue('password', clientCredentials.password);
    }, [clientCredentials]);

    function onSubmit(formData: any) {
        clientCredentials.serverUrl = formData.serverUrl;
        clientCredentials.username = formData.username;
        clientCredentials.password = formData.password;
        window.electronAPI.setClientCredentials(clientCredentials);
    }

    function onDisconnect() {
        // window.electronAPI.disconnectFromServer();
    }

    return (<HomePageStyled>
        <h1>{props.socketConnection.message}</h1>
        <h3>{props.socketConnection.description}</h3>
        <i className={connectionIcon.type} style={{
            color: connectionIcon.color,
            fontSize: '6em',
            margin: '20px'
        }} />

        <form onSubmit={handleSubmit(onSubmit)}>
            <table>
                <tbody>
                <tr>
                    <th>Server URL</th>
                    <td><FormInput type={InputType.Url} register={register} name={'serverUrl'} errors={errors} /></td>
                </tr>
                <tr>
                    <th>Username</th>
                    <td><FormInput type={InputType.Text} register={register} name={'username'} errors={errors} /></td>
                </tr>
                <tr>
                    <th>Password</th>
                    <td><FormInput type={InputType.Password} register={register} name={'password'} errors={errors} /></td>
                </tr>
                <tr>
                    <td colSpan={2}>{props.socketConnection.code === SocketConnectionStatusCode.CONNECTED ?
                        (<FormInput type={InputType.Button} onClick={() => onDisconnect} value={'Disconnect'} />) :
                        (<FormInput type={InputType.Submit} value={'Connect'} />)
                    }
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    </HomePageStyled>);
}

const HomePageStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
