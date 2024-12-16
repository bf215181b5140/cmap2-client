import { Page } from '../../components/page/page.component';
import React, { useEffect, useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications.hook';
import styled from 'styled-components';
import { GroupWidth } from 'cmap2-shared';
import './testing.style.css';
import Segment from '../../components/segment/segment.component';
import PageMenu from '../../components/menu/pageMenu/pageMenu.component';
import AvatarInput from '../../components/input/avatarInput/avatarInput.component';
import { useForm } from 'react-hook-form';
import TextButton from '../../components/buttons/textButton.component';

export default function TestingPage() {

  const [parameterBlacklist, setParameterBlacklist] = useState<string[]>([]);

  useEffect(() => {
    setParameterBlacklist(window.IPC.store.getSync('parameterBlacklist'));
  }, []);

  // useEffect(() => {
  //   window.IPC.store.get('parameterBlacklist').then(res => setParameterBlacklist(res));
  // }, []);

  function getStore() {
    window.IPC.store.get('parameterBlacklist').then(res => console.log('getStore result', res));
  }

  function setStore() {
    console.log('setStore');
    window.IPC.store.set('parameterBlacklist', ['1', '2', '3', '4', '5', '6']);
  }

  return (<Page flexDirection={'column'}>

    {parameterBlacklist && parameterBlacklist.map(pb => (<p>{pb}</p>))}

    <TextButton text={'get store'} onClick={() => getStore()} />
    <TextButton text={'set store'} onClick={() => setStore()} />

  </Page>);
}
