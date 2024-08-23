import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { useContext } from 'react';
import FormTable from '../../../../shared/components/form/formTable.component';
import SubmitInput from '../../../../shared/components/form/inputs/submit.component';
import Input from '../../../../shared/components/form/inputs/input.component';
import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import { LoginDTO, LoginSchema, LoginTokenDTO } from 'cmap2-shared';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import { ClientCredentials } from '../../../../../../shared/classes';
import { ClientCredentialsContext } from '../../../../contexts/contexts';

export default function LoginForm() {

    const cmapFetch = useCmapFetch();
    const {clientCredentials, setClientCredentials} = useContext(ClientCredentialsContext);
    const {register, formState: {errors}, handleSubmit, reset} = useForm<LoginDTO>({
        defaultValues: clientCredentials,
        resolver: zodResolver(LoginSchema)
    });

    async function onSubmit(formData: LoginDTO) {
        cmapFetch<LoginTokenDTO>('login', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        }, loginToken => {
            const newCredentials = {...formData, ...loginToken};
            setClientCredentials(newCredentials);
        });
    }

    function onClear() {
        setClientCredentials(new ClientCredentials());
        reset(new ClientCredentials());
    }

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <p>To use website feature you need to log in to or register a new website account.</p>
        <FormTable>
            <tr>
                <th>Username</th>
                <td><Input register={register} name={'username'} readOnly={!!clientCredentials.apiToken} errors={errors} /></td>
            </tr>
            <tr>
                <th>Password</th>
                <td><Input type="password" register={register} name={'password'} readOnly={!!clientCredentials.apiToken} errors={errors} /></td>
            </tr>
            <tr>
                <td></td>
                <td style={{textAlign: 'center'}}>
                    <ButtonInput text={'Clear'} onClick={onClear} />
                    <SubmitInput text={'Log in'} />
                </td>
            </tr>
        </FormTable>
    </form>);

}
