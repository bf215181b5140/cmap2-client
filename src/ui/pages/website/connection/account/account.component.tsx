import { useContext, useEffect, useRef } from 'react';
import { CredentialsContext } from '../../../../components/context/credentials.context';
import TextButton from '../../../../components/buttons/textButton.component';
import FormControlBar from '../../../../components/form/formControlBar.component';
import { SocketSettings, SocketSettingsSchema } from '../../../../../shared/objects/settings';
import useSocketConnection from '../../../../hooks/socketConnection.hook';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../components/form/formTable.component';
import CheckboxInput from '../../../../components/input/checkbox.component';

export default function Account() {

  const { credentials, clearLoginToken } = useContext(CredentialsContext);
  const { connected, message, color, icon } = useSocketConnection();
  const { register, formState: { errors }, handleSubmit, reset } = useForm<SocketSettings>({ resolver: zodResolver(SocketSettingsSchema) });
  const submitRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.IPC.get('getSocketSettings').then(data => reset(data));
  }, []);

  function onConnect() {
    window.IPC.send('connectSocket');
  }

  function onDisconnect() {
    window.IPC.send('disconnectSocket');
  }

  function onSubmit(data: SocketSettings) {
    window.IPC.send('saveSocketSettings', data);
  }

  return (<>
    <h2>Logged in as {credentials.displayName}</h2>
    <FormControlBar>
      <TextButton text={'Log out'} onClick={clearLoginToken} />
    </FormControlBar>
    <h2>Connection</h2>
    <span style={{ color: color }}>
      {message}
      <i className={icon} style={{ paddingLeft: '5px', fontSize: '20px' }} />
    </span>
    <FormTable>
      <tr>
        <td>Connect automatically</td>
        <td>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CheckboxInput name={'autoConnect'} register={register} errors={errors} onChange={() => submitRef.current?.click()} />
            <input type={'submit'} ref={submitRef} style={{ display: 'none' }} />
          </form>
        </td>
      </tr>
      <tr>
        <td></td>
        <td>{connected ? (
          <TextButton text={'Disconnect'} onClick={onDisconnect} />
        ) : (
          <TextButton text={'Connect'} onClick={onConnect} disabled={!credentials.apiToken} />
        )}</td>
      </tr>
    </FormTable>
  </>);

}