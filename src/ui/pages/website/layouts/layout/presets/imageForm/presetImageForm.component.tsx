import TypedEmitter from 'typed-emitter/rxjs';
import { RefObject, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { PresetDTO, UploadedFileSchema } from 'cmap2-shared';
import styled from 'styled-components';
import { PresetsSectionEvents } from '../presets.model';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import useFileValidation from '../../../../../../hooks/fileValidation.hook';
import { LayoutsPageContext } from '../../../layouts.context';
import Segment from '../../../../../../components/segment/segment.component';
import IconButton from '../../../../../../components/buttons/iconButton.component';
import TextButton from '../../../../../../components/buttons/textButton.component';

interface PresetImageFormProps {
  presetSectionEvents: TypedEmitter<PresetsSectionEvents>;
  preset: PresetDTO;
}

export default function PresetImageForm({ presetSectionEvents, preset }: PresetImageFormProps) {

  const { cmapFetch, DELETE } = useCmapFetch();
  const { validateImage } = useFileValidation();
  const { layoutsDispatch, layoutId } = useContext(LayoutsPageContext);
  const { register, watch, reset, handleSubmit } = useForm<{ file: FileList | null }>();
  const { ref, ...fileRegister } = register('file');
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const submitRef: RefObject<HTMLInputElement> = useRef(null);
  const file = watch('file')?.item(0);

  useImperativeHandle(ref, () => inputRef.current);

  useEffect(() => {
    function onPresetSaved() {
      submitRef.current?.click();
    }

    presetSectionEvents.on('onSaved', onPresetSaved);

    return () => {
      presetSectionEvents.removeListener('onSaved', onPresetSaved);
    };
  }, []);

  useEffect(() => {
    reset();
  }, [preset]);

  useEffect(() => {
    if (file) {
      validateImage(file,
        () => presetSectionEvents.emit('onImageChange', { id: '', fileName: file.name, urlPath: URL.createObjectURL(file) }),
        () => {
          presetSectionEvents.emit('onImageChange', null);
          reset();
        });
    }
  }, [file]);

  function onSubmit(formData: any) {
    if (formData.file[0] && preset?.id) {
      const postData = new FormData();
      postData.append('file', formData.file[0]);
      postData.append('id', preset.id);

      cmapFetch('layouts/preset/image', { method: 'POST', body: postData }, UploadedFileSchema, data => {
        layoutsDispatch({ type: 'changePresetPicture', layoutId: layoutId || '', presetId: preset.id, image: data });
        reset();
      });
    }
  }

  function onClear() {
    if (file) {
      presetSectionEvents.emit('onImageChange', null);
      reset();
    } else if (preset?.image) {
      DELETE('layouts/preset/image', { id: preset.id }, undefined, () => {
        layoutsDispatch({ type: 'changePresetPicture', layoutId: layoutId || '', presetId: preset.id, image: null });
        reset();
      });
    }
  }

  function onBrowse() {
    inputRef?.current?.click();
  }

  const browseIcon = !!file ? 'ri-image-edit-line' : 'ri-image-add-line';

  return (<Segment segmentTitle={'Edit image'} width={'Full'}>
    <PresetImageFormStyled>
      <div style={{ flexBasis: '100%' }}>
        <span style={{ flexBasis: '100%' }} className={'fileName'}>{file?.name}</span>
      </div>
      <div>
        <IconButton role={'normal'} tooltip={'Browse for file'} icon={browseIcon} onClick={onBrowse} />
      </div>
      <div>
        <IconButton role={'save'} tooltip={'Save image'} onClick={() => submitRef.current?.click()} disabled={!file || !preset?.id} />
        <TextButton text={'Remove image'} onClick={onClear} disabled={!file && !preset?.image} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'none' }}>
        <input type="file" {...fileRegister} ref={inputRef} />
        <input type="submit" ref={submitRef} />
      </form>
    </PresetImageFormStyled>
  </Segment>);
}

const PresetImageFormStyled = styled.div`
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
