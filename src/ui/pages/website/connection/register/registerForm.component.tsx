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
import Segment from '../../../../components/segment/segment.component';

interface RegisterFormProps {
  registrationInfo: RegisterInfoDTO | undefined;
  fingerprint: string;
  toLogin: () => void;
}

export default function RegisterForm({ registrationInfo, fingerprint, toLogin }: RegisterFormProps) {

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
      toLogin();
    });
  }

  return (<form onSubmit={handleSubmit(onSubmit)}>
    <HiddenInput register={register} name={'fingerprint'} />
    <FormTable visible={true}>
      <tr>
        <th style={{ width: '130px' }}>Username</th>
        <td style={{ width: '300px' }}><Input register={register} name={'username'} errors={errors} /></td>
        <td></td>
      </tr>
      <tr>
        <th>Password</th>
        <td><Input type="password" register={register} name={'password'} errors={errors} /></td>
        <td></td>
      </tr>
      <tr>
        <th>Confirm password</th>
        <td><Input type="password" register={register} name={'passwordRepeat'} errors={errors} /></td>
        <td></td>
      </tr>
      <tr>
        <th>Invite key</th>
        <td><Input register={register} name={'inviteKey'} errors={errors} /></td>
        <td>
          <FormControlBar margin={'0'}>
          <TextButton type={'submit'} text={'Register'} />
        </FormControlBar>
        </td>
      </tr>
    </FormTable>
  </form>);

}
