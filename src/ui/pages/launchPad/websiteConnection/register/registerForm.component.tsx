import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { RegisterFormDTO, RegisterFormSchema, RegisterInfoDTO, RegisterWithKeyFormDTO, RegisterWithKeyFormSchema } from 'cmap2-shared';
import { CredentialsContext } from '../../../../components/context/credentials.context';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import { Credentials } from '../../../../../shared/objects/credentials';
import FormTable from '../../../../components/form/formTable.component';
import Input from '../../../../components/input/input.component';
import TextButton from '../../../../components/buttons/textButton.component';
import HiddenInput from '../../../../components/input/hidden.component';
import { useNotifications } from '../../../../hooks/useNotifications.hook';
import FormControlBar from '../../../../components/form/formControlBar.component';

interface RegisterFormProps {
  registrationInfo: RegisterInfoDTO | undefined;
  fingerprint: string;
  loginSegment: () => void;
}

export default function RegisterForm({ registrationInfo, fingerprint, loginSegment }: RegisterFormProps) {

  const { PUT } = useCmapFetch();
  const { addNotification } = useNotifications();
  const { setCredentials } = useContext(CredentialsContext);
  const { register, formState: { errors }, handleSubmit } = useForm<RegisterWithKeyFormDTO>({
    resolver: zodResolver(registrationInfo?.keyRequired ? RegisterWithKeyFormSchema : RegisterFormSchema),
    defaultValues: {
      fingerprint: fingerprint
    }
  });

  async function onSubmit(formData: RegisterFormDTO) {
    PUT('register', formData, undefined, () => {
      addNotification('Success', 'Account registered!');
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
        <th style={{ width: '130px' }}>Username</th>
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
        <th>Invite key</th>
        <td><Input register={register} name={'inviteKey'} errors={errors} /></td>
      </tr>
    </FormTable>
    <FormControlBar>
      <TextButton type={'submit'} text={'Register'} />
    </FormControlBar>
  </form>);

}
