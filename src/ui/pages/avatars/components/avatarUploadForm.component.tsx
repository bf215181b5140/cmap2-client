import React, { ChangeEvent, useContext, useState } from 'react';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';
import { useForm } from 'react-hook-form';
import { ModalContext } from '../../../components/context/modal.context';
import { VrcOscAvatar, VrcOscAvatarSchema } from '../../../../shared/objects/vrcOscAvatar';
import IconButton from '../../../components/buttons/iconButton.component';
import FormControlBar from '../../../components/form/formControlBar.component';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../hooks/useNotifications.hook';
import { LayoutSchema } from 'cmap2-shared';
import BasicModal from '../../../components/modal/basicModal/basicModal.component';

interface AvatarUploadFormProps {
  avatars: VrcOscAvatar[];
  avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
}

interface AvatarUploadForm {
  file: FileList | undefined;
}

export default function AvatarUploadForm({ avatars, avatarsDispatch }: AvatarUploadFormProps) {

  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { setModal } = useContext(ModalContext);
  const { register, reset, handleSubmit } = useForm<AvatarUploadForm>({ defaultValues: { file: undefined } });
  const [fileAvatar, setFileAvatar] = useState<VrcOscAvatar | undefined>(undefined);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          try {
            const tempFileAvatar = JSON.parse(reader.result) as VrcOscAvatar;
            VrcOscAvatarSchema.parse(tempFileAvatar);
            setFileAvatar(tempFileAvatar);
          } catch (e) {
            addNotification('Error', 'Not recognized as a VRChat avatar file');
            setFileAvatar(undefined);
          }
        }
      };
      reader.readAsText(event.target.files[0]);
    } else {
      setFileAvatar(undefined);
    }
  }

  function onSubmit() {
    if (!fileAvatar) return;

    const existing = avatars.find(avatar => avatar.id === fileAvatar.id);
    if (existing) {
      setModal(<BasicModal title={`Saving ${fileAvatar.name}`} message={`Avatar with this ID already exists (${existing.name}), update avatar info and parameters?`}
                           confirmValue={'Update'} confirmFunction={() => addAvatar(fileAvatar)} />);
    } else {
      addAvatar(fileAvatar);
    }
  }

  function addAvatar(avatar: VrcOscAvatar) {
    avatarsDispatch({ type: 'addAvatar', avatar: avatar });
    addNotification('Success', 'Avatar saved');
    clearForm();
    navigate('/avatars/' + avatar.id);
  }

  function clearForm() {
    setFileAvatar(undefined);
    reset();
  }

  function browse() {
    const input = document.getElementById('fileInput');
    if (input) input.click();
  }

  function save() {
    const input = document.getElementById('fileSubmit');
    if (input) input.click();
  }

  return (<form onSubmit={handleSubmit(onSubmit)}>
    <input type="file" id="fileInput" style={{ display: 'none' }} {...register('file')} onChange={onFileChange} />
    <input type="submit" id="fileSubmit" style={{ display: 'none' }} />

    {fileAvatar && (<>
      <h3>Avatar found</h3>
      <i className={'ri-contacts-book-fill'} /> {fileAvatar.name}
      <p>{fileAvatar.id}</p>
    </>)}

    <FormControlBar>
      {fileAvatar && <>
        <IconButton role={'save'} onClick={save} icon={'ri-file-check-line'} />
        <IconButton role={'reset'} tooltip={'Clear'} onClick={clearForm} icon={'ri-file-close-line'} />
        <hr />
      </>}
      <IconButton role={'normal'} tooltip={'Open file'} onClick={browse} icon={'ri-file-search-line'} />
    </FormControlBar>

  </form>);
}
