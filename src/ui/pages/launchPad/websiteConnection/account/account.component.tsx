import { useContext, useEffect, useRef } from 'react';
import { CredentialsContext } from '../../../../components/context/credentials.context';
import TextButton from '../../../../components/buttons/textButton.component';
import useSocketConnection from '../../../../hooks/socketConnection.hook';
import { useForm } from 'react-hook-form';
import { SocketSettings, SocketSettingsSchema } from '../../../../../shared/objects/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import Segment from '../../../../components/segment/segment.component';
import FormTable from '../../../../components/form/formTable.component';
import CheckboxInput from '../../../../components/input/checkbox.component';

export default function Account() {

  const { credentials, clearLoginToken } = useContext(CredentialsContext);
  const { connected, message, color } = useSocketConnection();
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
    <TextButton text={'Log out'} onClick={clearLoginToken} />

    <h2 style={{ color: color, marginTop: '0' }}>{message}</h2>

    <p>When connected, the application will forward OSC messages from VRChat to the website and vice versa.</p>

    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTable>
        <tr>
          <th>Connect automatically</th>
          <td><CheckboxInput name={'autoConnect'} register={register} errors={errors} onChange={() => submitRef.current?.click()} /></td>
        </tr>
      </FormTable>
      <input type={'submit'} ref={submitRef} style={{ display: 'none' }} />
    </form>

    {connected ? (
      <TextButton text={'Disconnect'} onClick={onDisconnect} />
    ) : (
      <TextButton text={'Connect'} onClick={onConnect} disabled={!credentials.apiToken} />
    )}
  </>);

}