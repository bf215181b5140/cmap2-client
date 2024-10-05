import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import { CredentialsContext } from '../../../../../../components/context/credentials.context';
import { LoginFormDTO, LoginFormSchema, LoginTokenSchema } from 'cmap2-shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { Credentials } from '../../../../../../../shared/objects/credentials';
import TextButton from '../../../../../../components/buttons/textButton.component';
import FormTable from '../../../../../../components/form/formTable.component';
import Input from '../../../../../../components/input/input.component';

export default function Login() {

    const { POST } = useCmapFetch();
    const { credentials, setCredentials } = useContext(CredentialsContext);
    const {register, formState: {errors}, handleSubmit, reset} = useForm<LoginFormDTO>({
        defaultValues: credentials,
        resolver: zodResolver(LoginFormSchema)
    });

    async function onSubmit(formData: LoginFormDTO) {
        POST('login', formData, LoginTokenSchema, loginToken => {
            const newCredentials = {...formData, ...loginToken};
            setCredentials(newCredentials);
        });
    }

    function onClear() {
        setCredentials(new Credentials());
        reset(new Credentials());
    }

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <p>To use website features you need to log in to or register a new website account.</p>
        <FormTable>
            <tr>
                <th>Username</th>
                <td><Input register={register} name={'username'} readOnly={!!credentials.apiToken} errors={errors} /></td>
            </tr>
            <tr>
                <th>Password</th>
                <td><Input type="password" register={register} name={'password'} readOnly={!!credentials.apiToken} errors={errors} /></td>
            </tr>
            <tr>
                <td></td>
                <td style={{textAlign: 'center'}}>
                    <TextButton text={'Clear'} onClick={onClear} />
                    <TextButton type={'submit'} text={'Log in'} />
                </td>
            </tr>
        </FormTable>
    </form>);


}
