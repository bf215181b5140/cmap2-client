import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';
import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { URL } from '../../../shared/const';
import { FormTable } from '../../shared/components/form/formTable.component';
import FormInput from '../../shared/components/form/formInput.component';
import { InputType, ReactProps } from 'cmap2-shared';
import { SocketConnection, SocketConnectionType } from '../../../shared/SocketConnection';
import { ClientCredentialsContext } from '../../app/App';
import useConnectionIcon from '../../shared/hooks/connectionIcon.hook';

interface ConnectFormProps extends ReactProps {
    socketConnection: SocketConnection,
    setConnectForm: Dispatch<SetStateAction<boolean>>
}

export default function ConnectForm({socketConnection, setConnectForm}: ConnectFormProps) {

    const connectionIcon = useConnectionIcon(socketConnection);
    const {clientCredentials, setClientCredentials} = useContext(ClientCredentialsContext);

    const {register, setValue, reset, formState: {errors}, handleSubmit} = useForm({
        resolver: zodResolver(z.object({
            username: z.string(),
            password: z.string()
        }))
    });

    useEffect(() => {
        reset({...clientCredentials});
    }, [clientCredentials]);

    function onSubmit(formData: any) {
        const newCredentials = {...clientCredentials, ...formData, apiToken: undefined};
        setClientCredentials(newCredentials);
        window.electronAPI.setClientCredentials(newCredentials);
    }

    function onDisconnect() {
        window.electronAPI.disconnectSocket();
    }

    return (<><h1>{socketConnection.message}</h1>
    <h3>{socketConnection.description}</h3>
    <i className={connectionIcon.type} style={{
        color: connectionIcon.color,
        fontSize: '6em',
        margin: '20px'
    }} />
    <form onSubmit={handleSubmit(onSubmit)}>
        <FormTable>
            <tr>
                <th>Username</th>
                <td><FormInput type={InputType.Text} register={register} name={'username'}
                               disabled={socketConnection.type === SocketConnectionType.SUCCESS} errors={errors} /></td>
            </tr>
            <tr>
                <th>Password</th>
                <td><FormInput type={InputType.Password} register={register} name={'password'}
                               disabled={socketConnection.type === SocketConnectionType.SUCCESS} errors={errors} /></td>
            </tr>
            <tr>
                <td colSpan={2} style={{textAlign: 'center'}}>{socketConnection.type === SocketConnectionType.SUCCESS ?
                    (<FormInput type={InputType.Button} onClick={() => onDisconnect()} value={'Disconnect'} />) :
                    (<>
                        <FormInput type={InputType.Submit} value={'Connect'} />
                        <FormInput type={InputType.Button} onClick={() => setConnectForm(false)} value={'Register'} />
                    </>)
                }
                </td>
            </tr>
        </FormTable>
    </form></>);

}
