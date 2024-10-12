import { useContext, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CredentialsContext } from '../../../../components/context/credentials.context';
import Segment from '../../../../components/segment/segment.component';
import useSocketConnection from '../../../../hooks/socketConnection.hook';
import { SocketSettings, SocketSettingsSchema } from '../../../../../shared/objects/settings';
import FormTable from '../../../../components/form/formTable.component';
import TextButton from '../../../../components/buttons/textButton.component';
import CheckboxInput from '../../../../components/input/checkbox.component';

export default function WebsocketStatusSegment() {

  const { connected, message, color } = useSocketConnection();
  const { credentials: { apiToken } } = useContext(CredentialsContext);
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

  return (<Segment width={'Third'}>
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
      <TextButton text={'Connect'} onClick={onConnect} disabled={!apiToken} />
    )}
  </Segment>);
}


