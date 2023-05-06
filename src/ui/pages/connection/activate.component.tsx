import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';
import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { URL } from '../../../shared/const';
import { FormTable } from '../../shared/components/form/formTable.component';
import FormInput from '../../shared/components/form/formInput.component';
import { ButtonDto, InputType } from 'cmap2-shared';
import { SocketConnection, SocketConnectionType } from '../../../shared/SocketConnection';
import { activateSchema } from 'cmap2-shared/dist/validationSchemas';
import { ReactProps } from '../../../shared/global';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../../app/mainWindow/mainWindow.componenet';
import { ToastType } from '../../app/toast/toast.component';

interface ActivateFormProps extends ReactProps {
    socketConnection: SocketConnection,
    setConnectForm: Dispatch<SetStateAction<boolean>>
}

export default function ActivateForm({socketConnection, setConnectForm}: ActivateFormProps) {

    const withUrlSchema = activateSchema.innerType().merge(z.object({serverUrl: z.string()}));
    const {register, setValue, reset, formState: {errors}, handleSubmit} = useForm({resolver: zodResolver(withUrlSchema)});
    const navigate = useNavigate();
    const toastsDispatch = useContext(ToastContext);

    useEffect(() => {
        if (socketConnection.type === SocketConnectionType.SUCCESS) {
            navigate('/');
        }
    }, [socketConnection])

    useEffect(() => {
        reset({serverUrl: URL});
    }, [])

    function onSubmit(formData: any) {
        console.log(formData)
        const url = formData.serverUrl + '/api/activate';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'
        }}).then(res => {
            if (res?.ok) {
                toastsDispatch({
                    type: 'add',
                    toast: {message: 'Account activated!', type: ToastType.SUCCESS}
                });
                setConnectForm(true);
            } else {
                toastsDispatch({
                    type: 'add',
                    toast: {message: 'Activation failed', type: ToastType.ERROR}
                });
            }
        });
    }

    function onUrlReset() {
        setValue('serverUrl', URL);
    }

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <FormTable>
            <tr>
                <th>Server URL</th>
                <td>
                    <FormInput type={InputType.Url} register={register} name={'serverUrl'} errors={errors} />
                    <FormInput type={InputType.Button} onClick={() => onUrlReset()} value={'Default'} />
                </td>
            </tr>
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
                <th>Activation key</th>
                <td><FormInput type={InputType.Text} register={register} name={'activationKey'} errors={errors} /></td>
            </tr>
            <tr>
                <td colSpan={2} style={{textAlign: 'center'}}>
                    <FormInput type={InputType.Submit} value={'Activate'} />
                    <FormInput type={InputType.Button} onClick={() => setConnectForm(true)} value={'Back to connect'} />
                </td>
            </tr>
        </FormTable>
    </form>);

}
