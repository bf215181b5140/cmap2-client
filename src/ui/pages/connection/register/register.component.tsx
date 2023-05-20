import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { URL } from '../../../../shared/const';
import FormInput from '../../../shared/components/form/formInput.component';
import { InputType, ReactProps, RegistrationFormDto } from 'cmap2-shared';
import { SocketConnection, SocketConnectionType } from '../../../../shared/SocketConnection';
import { registrationSchema } from 'cmap2-shared/src/zodSchemas';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../../../app/mainWindow/mainWindow.componenet';
import { ToastType } from '../../../app/toast/toast.component';
import FormTable from '../../../shared/components/form/formTable.component';

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
    }, [socketConnection])

    function onSubmit(formData: RegistrationFormDto) {
        fetch(URL + '/api/register', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'
        }}).then(res => {
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
                <td><FormInput type={InputType.Text} register={register} name={'username'} errors={errors} /></td>
            </tr>
            <tr>
                <th rowSpan={2}>Password</th>
                <td><FormInput type={InputType.Password} register={register} name={'passwordOne'} errors={errors} /></td>
            </tr>
            <tr>
                <td><FormInput type={InputType.Password} register={register} name={'passwordTwo'} errors={errors} /></td>
            </tr>
            <tr>
                <th>Registration key</th>
                <td><FormInput type={InputType.Text} register={register} name={'registrationKey'} errors={errors} /></td>
            </tr>
            <tr>
                <td colSpan={2} style={{textAlign: 'center'}}>
                    <FormInput type={InputType.Submit} value={'Register'} />
                    <FormInput type={InputType.Button} onClick={() => setConnectForm(true)} value={'Back to connect'} />
                </td>
            </tr>
        </FormTable>
    </form>);

}
