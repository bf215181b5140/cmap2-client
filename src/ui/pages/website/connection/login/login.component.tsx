import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import { CredentialsContext } from '../../../../components/context/credentials.context';
import { LoginFormDTO, LoginFormSchema, LoginTokenSchema } from 'cmap-shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { Credentials } from '../../../../../shared/objects/credentials';
import TextButton from '../../../../components/buttons/textButton.component';
import FormTable from '../../../../components/form/formTable.component';
import Input from '../../../../components/input/input.component';
import FormControlBar from '../../../../components/form/formControlBar.component';
import Segment from '../../../../components/segment/segment.component';
import IconButton from '../../../../components/buttons/iconButton.component';

export default function Login() {

  const { POST } = useCmapFetch();
  const { credentials, setCredentials } = useContext(CredentialsContext);
  const { register, formState: { errors }, handleSubmit, reset } = useForm<LoginFormDTO>({
    defaultValues: credentials,
    resolver: zodResolver(LoginFormSchema)
  });

  async function onSubmit(formData: LoginFormDTO) {
    POST('login', formData, LoginTokenSchema, loginToken => {
      const newCredentials = { ...formData, ...loginToken };
      setCredentials(newCredentials);
    });
  }

  function onClear() {
    setCredentials(new Credentials());
    reset(new Credentials());
  }

  return (<Segment segmentTitle={'Login'}>
    <form onSubmit={handleSubmit(onSubmit)}>
    <p>To use website features you need to log in to or register a new website account.</p>
    <FormTable visible={true}>
      <tr>
        <th style={{ width: '80px' }}>Username</th>
        <td style={{ width: '300px' }}><Input register={register} name={'username'} readOnly={!!credentials.apiToken} errors={errors} /></td>
        <td></td>
      </tr>
      <tr>
        <th>Password</th>
        <td><Input type="password" register={register} name={'password'} readOnly={!!credentials.apiToken} errors={errors} /></td>
        <td>
          <FormControlBar margin={'0'}>
          <TextButton type={'submit'} text={'Log in'} />
          <TextButton text={'Clear'} onClick={onClear} />
          {/* <IconButton role={'save'} icon={'ri-login-box-line'} tooltip={'Log in'} type={'submit'} /> */}
          {/* <IconButton role={'reset'} icon={'ri-brush-2-fill'} tooltip={'Clear'} onClick={onClear} /> */}
        </FormControlBar>
        </td>
      </tr>
    </FormTable>

  </form>
  </Segment>);

}
