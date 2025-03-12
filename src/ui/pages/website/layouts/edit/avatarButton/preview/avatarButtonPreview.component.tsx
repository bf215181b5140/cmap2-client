import TypedEmitter from 'typed-emitter/rxjs';
import { useContext, useEffect, useState } from 'react';
import { AvatarButtonDTO, UploadedFileDTO } from 'cmap2-shared';
import { AvatarButtonComponent } from 'cmap2-shared/react';
import { EditAvatarButtonEvents } from '../editAvatarButton.model';
import { LayoutsPageContext } from '../../../layouts.context';
import Segment from '../../../../../../components/segment/segment.component';

interface AvatarButtonPreviewProps {
  avatarButtonEvents: TypedEmitter<EditAvatarButtonEvents>;
  avatarButton: AvatarButtonDTO | undefined;
}

export default function AvatarButtonPreview({ avatarButtonEvents, avatarButton }: AvatarButtonPreviewProps) {

  const { theme } = useContext(LayoutsPageContext);
  const [previewAvatar, setPreviewAvatar] = useState<AvatarButtonDTO | undefined>(avatarButton);

  useEffect(() => {
    function onAvatarFormChanged(formAvatar: AvatarButtonDTO) {
      setPreviewAvatar(state => ({ ...formAvatar, image: state?.image }));
    }

    function onImageChanged(image: UploadedFileDTO | null) {
      setPreviewAvatar(state => {
        if (state) return { ...state, image };
        return state;
      });
    }

    avatarButtonEvents.on('onFormChange', onAvatarFormChanged);
    avatarButtonEvents.on('onImageChange', onImageChanged);

    return () => {
      avatarButtonEvents.removeListener('onFormChange', onAvatarFormChanged);
      avatarButtonEvents.removeListener('onImageChange', onImageChanged);
    };
  }, []);

  useEffect(() => {
    setPreviewAvatar(avatarButton);
  }, [avatarButton, avatarButton?.image]);

  if (!previewAvatar) return;

  return (<Segment segmentTitle={'Preview'} width={'Full'}>
    <div style={{ maxWidth: '350px' }}>
      <AvatarButtonComponent theme={theme} avatarButton={previewAvatar} />
    </div>
  </Segment>);
}
