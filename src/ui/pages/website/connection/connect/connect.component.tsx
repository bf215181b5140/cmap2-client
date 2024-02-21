import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';
import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { ReactProps } from 'cmap2-shared';
import { SocketConnection, SocketConnectionType } from '../../../../../shared/SocketConnection';
import { ClientCredentialsContext } from '../../../../app/App';
import useConnectionIcon from '../../../../shared/hooks/connectionIcon.hook';
import FormTable from '../../../../shared/components/form/formTable.component';
import SubmitInput from '../../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import Input from '../../../../shared/components/form/inputs/input.component';

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
        const newCredentials = {...clientCredentials, ...formData};
        setClientCredentials(newCredentials);
        window.electronAPI.send('setClientCredentials', newCredentials);
    }

    function onDisconnect() {
        window.electronAPI.send('disconnectSocket');
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
                    <td><Input register={register} name={'username'} readOnly={socketConnection.type === SocketConnectionType.SUCCESS} errors={errors} /></td>
                </tr>
                <tr>
                    <th>Password</th>
                    <td><Input type="password" register={register} name={'password'} readOnly={socketConnection.type === SocketConnectionType.SUCCESS} errors={errors} /></td>
                </tr>
                <tr>
                    <td colSpan={2} style={{textAlign: 'center'}}>{socketConnection.type === SocketConnectionType.SUCCESS ?
                        (<ButtonInput onClick={() => onDisconnect()} text={'Disconnect'} />) :
                        (<>
                            <SubmitInput text={'Connect'} />
                            <ButtonInput onClick={() => setConnectForm(false)} text="Register" />
                        </>)
                    }
                    </td>
                </tr>
            </FormTable>
        </form>
    </>);

}
