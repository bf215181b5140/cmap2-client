import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { URL } from '../../../../shared/const';
import { ReactProps, RegistrationFormDto } from 'cmap2-shared';
import { SocketConnection, SocketConnectionType } from '../../../../shared/SocketConnection';
import { registrationSchema } from 'cmap2-shared/src/zodSchemas';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../../../app/mainWindow/mainWindow.componenet';
import { ToastType } from '../../../app/toast/toast.component';
import FormTable from '../../../shared/components/form/formTable.component';
import SubmitInput from '../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../shared/components/form/inputs/button.component';
import Input from '../../../shared/components/form/inputs/input.component';

interface ActivateFormProps extends ReactProps {
    socketConnection: SocketConnection,
    setConnectForm: Dispatch<SetStateAction<boolean>>
}

export default function RegistrationForm({socketConnection, setConnectForm}: ActivateFormProps) {

    const {register, setValue, reset, formState: {errors}, handleSubmit} = useForm<RegistrationFormDto>({resolver: zodResolver(registrationSchema)});
    const navigate = useNavigate();
    const toastsDispatch = useContext(ToastContext);

    useEffect(() => {
        if (socketConnection.type === SocketConnectionType.SUCCESS) {
            navigate('/');
        }
    }, [socketConnection]);

    function onSubmit(formData: RegistrationFormDto) {
        fetch(URL + '/api/register', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res?.ok) {
                toastsDispatch({
                    type: 'add',
                    toast: {message: 'Account registered!', type: ToastType.SUCCESS}
                });
                setConnectForm(true);
            } else {
                toastsDispatch({
                    type: 'add',
                    toast: {message: 'Registration failed', type: ToastType.ERROR}
                });
            }
        });
    }

    return (<form onSubmit={handleSubmit(onSubmit)}>
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
            <tr>
                <th>Registration key</th>
                <td><Input register={register} name={'registrationKey'} errors={errors} /></td>
            </tr>
            <tr>
                <td colSpan={2} style={{textAlign: 'center'}}>
                    <SubmitInput text={'Register'} />
                    <ButtonInput onClick={() => setConnectForm(true)} text="Back to connect" />
                </td>
            </tr>
        </FormTable>
    </form>);

}
