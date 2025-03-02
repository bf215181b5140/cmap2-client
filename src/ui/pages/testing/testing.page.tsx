import { Page } from '../../components/page/page.component';
import React, { useEffect } from 'react';
import './testing.style.css';
import TextButton from '../../components/buttons/textButton.component';

export default function TestingPage() {

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

  </Page>);
}
