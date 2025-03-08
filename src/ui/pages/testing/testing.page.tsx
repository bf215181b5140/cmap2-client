import { Page } from '../../components/page/page.component';
import React, { useEffect } from 'react';
import './testing.style.css';
import TextButton from '../../components/buttons/textButton.component';
import Segment from '../../components/segment/segment.component';
import { useNotifications } from '../../hooks/useNotifications.hook';

export default function TestingPage() {

  const { addNotification } = useNotifications();

  useEffect(() => {
    const listen = window.IPC.receive('updater:progress', data => console.log('updated progress', data))

    return () => {
      listen();
    };
  }, []);

  function onClick() {
    window.IPC.send('updater:downloadAndInstall', 'https://github.com/bf215181b5140/cmap2-client/releases/download/v2.3.4/Change.my.avatar.params.Setup.2.3.4.exe');
  }

  return (<Page flexDirection={'column'}>

    <TextButton text={'download'} onClick={() => onClick()} />

    <Segment>
      <TextButton text={'Info'} onClick={() => addNotification('Info', 'This is an example info notification')} />
      <TextButton text={'Success'} onClick={() => addNotification('Success', 'This is an example success notification')} />
      <TextButton text={'Warning'} onClick={() => addNotification('Warning', 'This is an example warning notification')} />
      <TextButton text={'Error'} onClick={() => addNotification('Error', 'This is an example error notification!')} />
    </Segment>

  </Page>);
}
