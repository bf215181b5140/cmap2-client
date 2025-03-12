import { useState } from 'react';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import Section from '../../../../../components/section/section.component';
import { EditAvatarButtonEvents } from './editAvatarButton.model';
import useEditPageItems from '../hooks/editPageItems.hook';
import { Page } from '../../../../../components/page/page.component';
import EditPageMenu from '../menu/editPageMenu.component';
import AvatarButtonPreview from './preview/avatarButtonPreview.component';
import AvatarButtonImageForm from './imageForm/avatarButtonImageForm.component';
import AvatarButtonForm from './form/avatarButtonForm.component';

export default function EditAvatarButtonPage() {

  const { avatarButton } = useEditPageItems();
  const [avatarButtonEvents] = useState(new EventEmitter() as TypedEmitter<EditAvatarButtonEvents>);

  return (<Page flexDirection={'row'}>

    <EditPageMenu />

    <Section direction={'column'} style={{ minWidth: '300px', flex: 1, height: 'min-content' }}>
      <AvatarButtonPreview avatarButtonEvents={avatarButtonEvents} avatarButton={avatarButton} />
      <AvatarButtonImageForm avatarButtonEvents={avatarButtonEvents} avatarButton={avatarButton} />
    </Section>

    <AvatarButtonForm avatarButtonEvents={avatarButtonEvents} avatarButton={avatarButton} />

  </Page>);
}