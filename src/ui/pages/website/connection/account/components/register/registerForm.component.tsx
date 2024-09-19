import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { ReactProps, RegisterFormDTO, RegisterKeySchema, RegisterDTO, RegisterInfoDTO, RegisterFormSchema } from 'cmap2-shared';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../../../../components/mainWindow/mainWindow.componenet';
import FormTable from '../../../../shared/components/form/formTable.component';
import SubmitInput from '../../../../shared/components/form/inputs/submit.component';
import Input from '../../../../shared/components/form/inputs/input.component';
import { ToastType } from '../../../../../../components/toast/toast.hook';
import HiddenInput from '../../../../shared/components/form/inputs/hidden.component';
import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import { ClientCredentialsContext } from '../../../../contexts/contexts';

interface RegisterFormProps extends ReactProps {
    setShowLogin: Dispatch<SetStateAction<boolean>>;
    registrationInfo: RegisterInfoDTO;
}

export default function RegisterForm({setShowLogin, registrationInfo}: RegisterFormProps) {

    const cmapFetch = useCmapFetch();
    const {clientCredentials, setClientCredentials} = useContext(ClientCredentialsContext);
    const {register, setValue, formState: {errors}, handleSubmit} = useForm<RegisterFormDTO>({
        resolver: zodResolver(registrationInfo.keyRequired ? RegisterFormSchema.innerType().merge(RegisterKeySchema) : RegisterFormSchema)
    });

    const toastsDispatch = useContext(ToastContext);

    useEffect(() => {
        window.electronAPI.get('getFingerprint').then(data => setValue('fingerprint', data));
    }, []);

    async function onSubmit(formData: RegisterFormDTO) {
        const requestDto: RegisterDTO = {
            username: formData.username,
            password: formData.passwordOne,
            fingerprint: formData.fingerprint,
            registrationKey: formData.registrationKey
        };

        cmapFetch('register', {
            method: 'PUT',
            body: JSON.stringify(requestDto),
            headers: {
                'Content-Type': 'application/json'
            }
        }, () => {
            toastsDispatch({
                type: 'add',
                toast: {message: 'Account registered!', type: ToastType.SUCCESS}
            });
            setClientCredentials({
                ...clientCredentials,
                username: formData.username,
                password: ''
            });
            setShowLogin(true);
        });
    }

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <p>Create a new account for the website.</p>
        <HiddenInput register={register} name={'fingerprint'} />
        <FormTable thAlign={'right'}>
            <tr>
                <th>Username</th>
                <td><Input register={register} name={'username'} errors={errors} /></td>
            </tr>
            <tr>
                <th>Password</th>
                <td><Input type="password" register={register} name={'passwordOne'} errors={errors} /></td>
            </tr>
            <tr>
                <th>Confirm password</th>
                <td><Input type="password" register={register} name={'passwordTwo'} errors={errors} /></td>
            </tr>
            {registrationInfo.keyRequired &&
                <tr>
                    <th>Registration key</th>
                    <td><Input register={register} name={'registrationKey'} errors={errors} /></td>
                </tr>}
            <tr>
                <td></td>
                <td style={{textAlign: 'center'}}>
                    <SubmitInput text={'Register'} />
                </td>
            </tr>
        </FormTable>
    </form>);

}
