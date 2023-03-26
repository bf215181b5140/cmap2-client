import { useContext, useEffect } from 'react';
import { InputType } from 'cmap2-shared';
import { ClientCredentialsContext } from '../App';
import useConnectionIcon from '../hooks/connectionIcon.hook';
import styled from 'styled-components';
import FormInput from '../components/form/formInput.component';
import { SocketConnection, SocketConnectionType } from '../../shared/SocketConnection';
import { ReactProps } from '../../shared/global';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';

interface ConnectionPageProps extends ReactProps {
    socketConnection: SocketConnection;
}

export default function ConnectionPage(props: ConnectionPageProps) {

    const clientCredentials = useContext(ClientCredentialsContext);
    const connectionIcon = useConnectionIcon(props.socketConnection);

    const {register, setValue, formState: {errors}, handleSubmit} = useForm({
        resolver: zodResolver(z.object({
            serverUrl: z.string().url(),
            username: z.string(),
            password: z.string(),
            autoLogin: z.boolean()
        }))
    });

    useEffect(() => {
        setValue('serverUrl', clientCredentials.serverUrl);
        setValue('username', clientCredentials.username);
        setValue('password', clientCredentials.password);
        setValue('autoLogin', clientCredentials.autoLogin);
    }, [clientCredentials]);

    function onSubmit(formData: any) {
        clientCredentials.serverUrl = formData.serverUrl;
        clientCredentials.username = formData.username;
        clientCredentials.password = formData.password;
        clientCredentials.autoLogin = formData.autoLogin;
        window.electronAPI.setClientCredentials(clientCredentials);
    }

    function onDisconnect() {
        window.electronAPI.disconnectSocket();
    }

    function onUrlReset() {
        setValue('serverUrl', 'http://localhost:8080');
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
                    <td><FormInput type={InputType.Url} register={register} name={'serverUrl'} errors={errors} /><FormInput type={InputType.Button} onClick={() => onUrlReset()} value={'Reset'} /></td>
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
                    <th>Connect automatically</th>
                    <td><FormInput type={InputType.Boolean} register={register} name={'autoLogin'} errors={errors} /></td>
                </tr>
                <tr>
                    <td colSpan={2}>{props.socketConnection.type === SocketConnectionType.SUCCESS ?
                        (<FormInput type={InputType.Button} onClick={() => onDisconnect()} value={'Disconnect'} />) :
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
