import TypedEmitter from 'typed-emitter/rxjs';
import { RefObject, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { LayoutDTO, AvatarButtonDTO, UploadedFileSchema } from 'cmap2-shared';
import styled from 'styled-components';
import { EditAvatarButtonEvents } from '../editAvatarButton.model';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import useFileValidation from '../../../../../../hooks/fileValidation.hook';
import { LayoutsPageContext } from '../../../layouts.context';
import Segment from '../../../../../../components/segment/segment.component';
import IconButton from '../../../../../../components/buttons/iconButton.component';
import FormControlBar from '../../../../../../components/form/formControlBar.component';

interface AvatarButtonImageFormProps {
  avatarButtonEvents: TypedEmitter<EditAvatarButtonEvents>;
  avatarButton: AvatarButtonDTO | undefined;
}

interface AvatarButtonImageForm {
  id: string
  file: FileList | null,
}

export default function AvatarButtonImageForm({ avatarButtonEvents, avatarButton }: AvatarButtonImageFormProps) {

  const { cmapFetch, DELETE } = useCmapFetch();
  const { validateImage } = useFileValidation();
  const { avatarButtonsDispatch } = useContext(LayoutsPageContext);

  const defaultValues: AvatarButtonImageForm = { file: null, id: avatarButton?.id || '' };

  const { register, setValue, watch, reset, handleSubmit } = useForm<AvatarButtonImageForm>({ defaultValues });
  const { ref, ...fileRegister } = register('file');
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const submitRef: RefObject<HTMLInputElement> = useRef(null);
  const id = watch('id');
  const file = watch('file')?.item(0);

  useImperativeHandle(ref, () => inputRef.current);

  useEffect(() => {
    function onAvatarSaved(savedAvatar: AvatarButtonDTO) {
      setValue('id', savedAvatar.id);
      submitRef.current?.click();
    }

    avatarButtonEvents.on('onSaved', onAvatarSaved);

    return () => {
      avatarButtonEvents.removeListener('onSaved', onAvatarSaved);
    };
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [avatarButton]);

  useEffect(() => {
    if (file) {
      validateImage(file,
        () => {
          if (id) {
            submitRef.current?.click();
          } else {
            avatarButtonEvents.emit('onImageChange', { id: '', fileName: file.name, urlPath: URL.createObjectURL(file) });
          }
        },
        () => {
          avatarButtonEvents.emit('onImageChange', null);
          reset(defaultValues);
        });
    }
  }, [file]);

  function onSubmit(formData: AvatarButtonImageForm) {
    if (formData.file?.[0] && formData?.id) {
      const postData = new FormData();
      postData.append('file', formData.file[0]);
      postData.append('id', formData.id);

      cmapFetch('layouts/avatarButton/image', { method: 'POST', body: postData }, UploadedFileSchema, data => {
        avatarButtonsDispatch({ type: 'changePicture', avatarButtonId: formData.id, image: data });
        reset(defaultValues);
      });
    }
  }

  function onClear() {
    if (file) {
      avatarButtonEvents.emit('onImageChange', null);
      reset(defaultValues);
    } else if (avatarButton?.image) {
      DELETE('layouts/avatarButton/image', { id: avatarButton.id }, undefined, () => {
        avatarButtonsDispatch({ type: 'changePicture', avatarButtonId: avatarButton.id, image: null });
        avatarButtonEvents.emit('onImageChange', null);
        reset(defaultValues);
      });
    }
  }

  function onBrowse() {
    inputRef?.current?.click();
  }

  return (<Segment segmentTitle={'Edit image'} width={'Full'}>

    Upload PNG or JPEG files, up to 3MB.

    <FormControlBar >
      <IconButton role={'normal'} tooltip={'Browse for file'} icon={'ri-image-add-line'} onClick={onBrowse} />
      <hr />
      <IconButton  role={'remove'} tooltip={'Remove image'} onClick={onClear} disabled={!file && !avatarButton?.image} />
    </FormControlBar>

    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'none' }}>
      <input type="file" {...fileRegister} ref={inputRef} />
      <input type="submit" ref={submitRef} />
    </form>

  </Segment>);
}
