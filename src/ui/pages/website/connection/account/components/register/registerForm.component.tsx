import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { RegisterFormDTO, RegisterInfoDTO, RegisterFormSchema, RegisterWithKeyFormSchema } from 'cmap2-shared';
import { CredentialsContext } from '../../../../../../components/context/credentials.context';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import { Credentials } from '../../../../../../../shared/types';
import FormTable from '../../../../../../components/form/formTable.component';
import Input from '../../../../../../components/input/input.component';
import TextButton from '../../../../../../components/buttons/textButton.component';
import HiddenInput from '../../../../../../components/input/hidden.component';
import { useNotifications } from '../../../../../../hooks/useNotifications.hook';

interface RegisterFormProps {
    registrationInfo: RegisterInfoDTO | undefined;
    fingerprint: string;
    loginSegment: () => void;
}

export default function RegisterForm({ registrationInfo, fingerprint, loginSegment }: RegisterFormProps) {

    const { PUT } = useCmapFetch();
    const { addNotification } = useNotifications();
    const { setCredentials } = useContext(CredentialsContext);
    const { register, formState: { errors }, handleSubmit } = useForm<RegisterFormDTO>({
        resolver: zodResolver(registrationInfo?.keyRequired ? RegisterWithKeyFormSchema : RegisterFormSchema),
        defaultValues: {
            fingerprint: fingerprint
        }
    });

    async function onSubmit(formData: RegisterFormDTO) {
        PUT('register', formData, undefined, () => {
            addNotification('success', 'Account registered!');
            setCredentials({
                ...new Credentials(),
                username: formData.username,
            });
            loginSegment();
        });
    }

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <HiddenInput register={register} name={'fingerprint'} />
        <FormTable thAlign={'right'}>
            <tr>
                <th>Username</th>
                <td><Input register={register} name={'username'} errors={errors} /></td>
            </tr>
            <tr>
                <th>Password</th>
                <td><Input type="password" register={register} name={'password'} errors={errors} /></td>
            </tr>
            <tr>
                <th>Confirm password</th>
                <td><Input type="password" register={register} name={'passwordRepeat'} errors={errors} /></td>
            </tr>
            <tr>
                <th>Account key</th>
                <td><Input register={register} name={'accountKey'} errors={errors} /></td>
            </tr>
            <tr>
                <td></td>
                <td style={{ textAlign: 'center' }}>
                    <TextButton type={'submit'} text={'Register'} />
                </td>
            </tr>
        </FormTable>
    </form>);

}
