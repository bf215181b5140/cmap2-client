import { ButtonSectionEvents } from '../button.model';
import TypedEmitter from 'typed-emitter/rxjs';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import useFileValidation from '../../../../../hooks/fileValidation.hook';
import { RefObject, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import { useForm } from 'react-hook-form';
import { ParameterButtonDTO, UploadedFileSchema } from 'cmap2-shared';
import Segment from '../../../../../components/segment/segment.component';
import IconButton from '../../../../../components/buttons/iconButton.component';
import TextButton from '../../../../../components/buttons/textButton.component';
import styled from 'styled-components';

interface ButtonImageFormProps {
  buttonSectionEvents: TypedEmitter<ButtonSectionEvents>;
}

interface ButtonImageForm {
  id: string
  file: FileList | null,
}

export default function ButtonImageForm({ buttonSectionEvents }: ButtonImageFormProps) {

  const { cmapFetch, DELETE } = useCmapFetch();
  const { validateImage } = useFileValidation();
  const { layoutsDispatch, layoutId, groupId, parameterButton } = useContext(LayoutsPageContext);

  const defaultValues: ButtonImageForm = { file: null, id: parameterButton?.id || '' };

  const { register, setValue, watch, reset, handleSubmit } = useForm<ButtonImageForm>({ defaultValues });
  const { ref, ...fileRegister } = register('file');
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const submitRef: RefObject<HTMLInputElement> = useRef(null);
  const file = watch('file')?.item(0);

  useImperativeHandle(ref, () => inputRef.current);

  useEffect(() => {
    function onButtonSaved(savedButton: ParameterButtonDTO) {
      setValue('id', savedButton.id);
      submitRef.current?.click();
    }

    buttonSectionEvents.on('onButtonSaved', onButtonSaved);

    return () => {
      buttonSectionEvents.removeListener('onButtonSaved', onButtonSaved);
    };
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [parameterButton]);

  useEffect(() => {
    if (file) {
      validateImage(file,
        () => buttonSectionEvents.emit('onImageChange', { id: '', fileName: file.name, urlPath: URL.createObjectURL(file) }),
        () => {
          buttonSectionEvents.emit('onImageChange', null);
          reset(defaultValues);
        });
    }
  }, [file]);

  function onSubmit(formData: ButtonImageForm) {
    if (formData.file?.[0] && formData.id) {
      const postData = new FormData();
      postData.append('file', formData.file[0]);
      postData.append('id', formData.id);

      cmapFetch('layouts/button/image', { method: 'POST', body: postData }, UploadedFileSchema, data => {
        layoutsDispatch({ type: 'changeButtonPicture', layoutId: layoutId || '', groupId: groupId || '', buttonId: formData.id, image: data });
        reset(defaultValues);
      });
    }
  }

  function onClear() {
    if (file) {
      buttonSectionEvents.emit('onImageChange', null);
      reset(defaultValues);
    } else if (parameterButton?.image) {
      DELETE('layouts/button/image', { id: parameterButton.id }, undefined, () => {
        layoutsDispatch({ type: 'changeButtonPicture', layoutId: layoutId || '', groupId: groupId || '', buttonId: parameterButton.id, image: null });
        reset(defaultValues);
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
        <IconButton role={'save'} tooltip={'Save image'} onClick={() => submitRef.current?.click()} disabled={!file || !parameterButton?.id} />
        <TextButton text={'Remove image'} onClick={onClear} disabled={!file && !parameterButton?.image} />
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
