import { useContext, useRef } from 'react';
import { CredentialsContext } from '../../../../components/context/credentials.context';
import TextButton from '../../../../components/buttons/textButton.component';
import FormControlBar from '../../../../components/form/formControlBar.component';
import { SocketSettings, SocketSettingsSchema } from '../../../../../shared/objects/settings';
import useSocketConnection from '../../../../hooks/socketConnection.hook';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../components/form/formTable.component';
import CheckboxInput from '../../../../components/input/checkbox.component';
import Segment from '../../../../components/segment/segment.component';
import { theme } from '../../../../style/theme';

export default function Status() {

  const { credentials, clearLoginToken } = useContext(CredentialsContext);
  const { connected, message, color, icon } = useSocketConnection();
  const { register, formState: { errors }, handleSubmit, reset } = useForm<SocketSettings>({
    resolver: zodResolver(SocketSettingsSchema),
    defaultValues: window.IPC.store.getSync('socket'),
  });
  const submitRef = useRef<HTMLInputElement>(null);

  function onConnect() {
    window.IPC.send('socket:connect');
  }

  function onDisconnect() {
    window.IPC.send('socket:disconnect');
  }

  function onSubmit(value: SocketSettings) {
    window.IPC.store.set('socket', value);
    reset(value);
  }

  return (<Segment segmentTitle={'Connection status'}>
      <p>Logged in as <b>{credentials.displayName}</b> <i className={'ri-check-line'} style={{ color: theme.colors.success, fontSize: '20px' }} /></p>

      <div style={{ color: color, marginBottom: '15px' }}>
        <i className={icon} style={{ paddingRight: '5px', fontSize: '20px' }} />
        {message}
      </div>

      <FormTable visible={true}>
        <tr>
          <td style={{ width: '155px' }}>Connect automatically</td>
          <td>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CheckboxInput name={'autoConnect'} register={register} errors={errors} onChange={() => submitRef.current?.click()} />
              <input type={'submit'} ref={submitRef} style={{ display: 'none' }} />
            </form>
          </td>
          <td>
            <FormControlBar margin={'0'}>
              {connected ? (
                <TextButton text={'Disconnect'} onClick={onDisconnect} />
              ) : (
                <TextButton text={'Connect'} onClick={onConnect} disabled={!credentials.apiToken} />
              )}
              <TextButton text={'Log out'} onClick={clearLoginToken} />
            </FormControlBar>
          </td>
        </tr>
      </FormTable>
    </Segment>
  );
}