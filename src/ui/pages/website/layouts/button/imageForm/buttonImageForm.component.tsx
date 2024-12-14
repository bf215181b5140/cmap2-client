import { ButtonSectionEvents } from '../button.model';
import TypedEmitter from 'typed-emitter/rxjs';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import useFileValidation from '../../../../../hooks/fileValidation.hook';
import { RefObject, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import { useForm } from 'react-hook-form';
import { UploadedFileSchema } from 'cmap2-shared';
import Segment from '../../../../../components/segment/segment.component';
import IconButton from '../../../../../components/buttons/iconButton.component';
import TextButton from '../../../../../components/buttons/textButton.component';
import styled from 'styled-components';

interface ButtonImageFormProps {
  buttonSectionEvents: TypedEmitter<ButtonSectionEvents>;
}

export default function ButtonImageForm({ buttonSectionEvents }: ButtonImageFormProps) {

  const { cmapFetch, DELETE } = useCmapFetch();
  const { validateImage } = useFileValidation();
  const { layoutsDispatch, layoutId, groupId, button } = useContext(LayoutsPageContext);
  const { register, watch, reset, handleSubmit } = useForm<{ file: FileList | null }>();
  const { ref, ...fileRegister } = register('file');
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const submitRef: RefObject<HTMLInputElement> = useRef(null);
  const file = watch('file')?.item(0);

  useImperativeHandle(ref, () => inputRef.current);

  useEffect(() => {
    function onButtonSaved() {
      submitRef.current?.click();
    }

    buttonSectionEvents.on('onButtonSaved', onButtonSaved);

    return () => {
      buttonSectionEvents.removeListener('onButtonSaved', onButtonSaved);
    };
  }, []);

  useEffect(() => {
    reset();
  }, [button]);

  useEffect(() => {
    if (file) {
      validateImage(file,
        () => buttonSectionEvents.emit('onImageChange', { id: '', fileName: file.name, urlPath: URL.createObjectURL(file) }),
        () => {
          buttonSectionEvents.emit('onImageChange', null);
          reset();
        });
    }
  }, [file]);

  function onSubmit(formData: any) {
    if (formData.file[0] && button?.id) {
      const postData = new FormData();
      postData.append('file', formData.file[0]);
      postData.append('id', button.id);
      postData.append('test', 'button.id');

      cmapFetch('layouts/button/image', { method: 'POST', body: postData }, UploadedFileSchema, data => {
        layoutsDispatch({ type: 'changeButtonPicture', layoutId: layoutId || '', groupId: groupId || '', buttonId: button.id, image: data });
        reset();
      });
    }
  }

  function onClear() {
    if (file) {
      buttonSectionEvents.emit('onImageChange', null);
      reset();
    } else if (button?.image) {
      DELETE('layouts/button/image', { id: button.id }, undefined, () => {
        layoutsDispatch({ type: 'changeButtonPicture', layoutId: layoutId || '', groupId: groupId || '', buttonId: button.id, image: null });
        reset();
      });
    }
  }

  function onBrowse() {
    inputRef?.current?.click();
  }

  const browseIcon = !!file ? 'ri-image-edit-line' : 'ri-image-add-line';

  return (<Segment segmentTitle={'Edit image'} width={'Full'}>
    <ButtonImageFormStyled>
      <div style={{ flexBasis: '100%' }}>
        <span style={{ flexBasis: '100%' }} className={'fileName'}>{file?.name}</span>
      </div>
      <div>
        <IconButton role={'normal'} tooltip={'Browse for file'} icon={browseIcon} onClick={onBrowse} />
      </div>
      <div>
        <IconButton role={'save'} tooltip={'Save image'} onClick={() => submitRef.current?.click()} disabled={!file || !button?.id} />
        <TextButton text={'Remove image'} onClick={onClear} disabled={!file && !button?.image} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'none' }}>
        <input type="file" {...fileRegister} ref={inputRef} />
        <input type="submit" ref={submitRef} />
      </form>
    </ButtonImageFormStyled>
  </Segment>);
}

const ButtonImageFormStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  span.fileName {
    display: block;
    max-width: 270px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0;
    margin: 0;
  }
`;
