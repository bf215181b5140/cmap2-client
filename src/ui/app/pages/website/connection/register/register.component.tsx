import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { URL } from '../../../../../../shared/const';
import { ReactProps, RegistrationFormDto, RegistrationInfoDto } from 'cmap2-shared';
import { SocketConnection, SocketConnectionType } from '../../../../../../shared/SocketConnection';
import { registrationSchema } from 'cmap2-shared/src/zodSchemas';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../../../../components/mainWindow/mainWindow.componenet';
import FormTable from '../../../../shared/components/form/formTable.component';
import SubmitInput from '../../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import Input from '../../../../shared/components/form/inputs/input.component';
import { ToastType } from '../../../../components/toast/toast.hook';
import HiddenInput from '../../../../shared/components/form/inputs/hidden.component';

interface ActivateFormProps extends ReactProps {
    socketConnection: SocketConnection,
    setConnectForm: Dispatch<SetStateAction<boolean>>
}

export default function RegistrationForm({socketConnection, setConnectForm}: ActivateFormProps) {

    const { register, setValue, formState: {errors}, handleSubmit } = useForm<RegistrationFormDto>({resolver: zodResolver(registrationSchema)});
    const [regAvailable, setRegAvailable] = useState<boolean>(true);
    const [regKeyRequired, setRegKeyRequired] = useState<boolean>(false);
    const navigate = useNavigate();
    const toastsDispatch = useContext(ToastContext);

    useEffect(() => {
        window.electronAPI.get('getFingerprint').then(data => setValue('fingerprint', data));

        fetch(URL + '/api/register', {
            method: 'GET',
        }).then(async res => {
            if (res?.ok) {
                const response = await res.json() as RegistrationInfoDto;
                if (response.available !== undefined) setRegAvailable(response.available);
                if (response.keyRequired !== undefined) setRegKeyRequired(response.keyRequired);
            }
        });
    }, []);

    useEffect(() => {
        if (socketConnection.type === SocketConnectionType.SUCCESS) {
            navigate('/website/');
        }
    }, [socketConnection]);

    function onSubmit(formData: RegistrationFormDto) {
        fetch(URL + '/api/register', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async res => {
            if (res?.ok) {
                toastsDispatch({
                    type: 'add',
                    toast: {message: 'Account registered!', type: ToastType.SUCCESS}
                });
                setConnectForm(true);
            } else {
                const response = await res.json()
                toastsDispatch({
                    type: 'add',
                    toast: {message: response.message, type: ToastType.ERROR}
                });
            }
        });
    }

    return (<>
        {regAvailable ? (
            <form onSubmit={handleSubmit(onSubmit)}>
                <HiddenInput name={'registrationKey'} />
                <FormTable>
                    <tr>
                        <th>Username</th>
                        <td><Input register={register} name={'username'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th rowSpan={2}>Password</th>
                        <td><Input type="password" register={register} name={'passwordOne'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <td><Input type="password" register={register} name={'passwordTwo'} errors={errors} /></td>
                    </tr>
                    {regKeyRequired &&
                        <tr>
                            <th>Registration key</th>
                            <td><Input register={register} name={'registrationKey'} errors={errors} /></td>
                        </tr>}
                    <tr>
                        <td colSpan={2} style={{textAlign: 'center'}}>
                            <SubmitInput text={'Register'} />
                            <ButtonInput onClick={() => setConnectForm(true)} text="Back to connect" />
                        </td>
                    </tr>
                </FormTable>
            </form>
        ) : (<>
            <h1>Server is not accepting registrations currently</h1>
            <ButtonInput onClick={() => setConnectForm(true)} text="Back to connect" />
        </>)}
    </>);

}
