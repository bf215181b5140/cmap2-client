import TypedEmitter from 'typed-emitter/rxjs';
import { RefObject, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { PresetButtonDTO, UploadedFileSchema } from 'cmap2-shared';
import styled from 'styled-components';
import { PresetsSectionEvents } from '../presets.model';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import useFileValidation from '../../../../../../hooks/fileValidation.hook';
import { LayoutsPageContext } from '../../../layouts.context';
import Segment from '../../../../../../components/segment/segment.component';
import IconButton from '../../../../../../components/buttons/iconButton.component';
import TextButton from '../../../../../../components/buttons/textButton.component';
import HiddenInput from '../../../../../../components/input/hidden.component';

interface PresetImageFormProps {
  presetSectionEvents: TypedEmitter<PresetsSectionEvents>;
  preset: PresetButtonDTO;
}

interface PresetImageForm {
  id: string
file: FileList | null,
}

export default function PresetImageForm({ presetSectionEvents, preset }: PresetImageFormProps) {

  const { cmapFetch, DELETE } = useCmapFetch();
  const { validateImage } = useFileValidation();
  const { layoutsDispatch, layoutId } = useContext(LayoutsPageContext);

  const defaultValues: PresetImageForm = { file: null, id: preset.id };

  const { register, setValue, watch, reset, handleSubmit } = useForm<PresetImageForm>({ defaultValues });
  const { ref, ...fileRegister } = register('file');
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const submitRef: RefObject<HTMLInputElement> = useRef(null);
  const file = watch('file')?.item(0);

  useImperativeHandle(ref, () => inputRef.current);

  useEffect(() => {
    function onPresetSaved(savedPreset: PresetButtonDTO) {
      setValue('id', savedPreset.id);
      submitRef.current?.click();
    }

    presetSectionEvents.on('onSaved', onPresetSaved);

    return () => {
      presetSectionEvents.removeListener('onSaved', onPresetSaved);
    };
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [preset]);

  useEffect(() => {
    if (file) {
      validateImage(file,
        () => presetSectionEvents.emit('onImageChange', { id: '', fileName: file.name, urlPath: URL.createObjectURL(file) }),
        () => {
          presetSectionEvents.emit('onImageChange', null);
          reset(defaultValues);
        });
    }
  }, [file]);

  function onSubmit(formData: PresetImageForm) {
    if (formData.file?.[0] && formData?.id) {
      const postData = new FormData();
      postData.append('file', formData.file[0]);
      postData.append('id', formData.id);

      cmapFetch('layouts/preset/image', { method: 'POST', body: postData }, UploadedFileSchema, data => {
        layoutsDispatch({ type: 'changePresetPicture', layoutId: layoutId || '', presetId: formData.id, image: data });
        reset(defaultValues);
      });
    }
  }

  function onClear() {
    if (file) {
      presetSectionEvents.emit('onImageChange', null);
      reset(defaultValues);
    } else if (preset?.image) {
      DELETE('layouts/preset/image', { id: preset.id }, undefined, () => {
        layoutsDispatch({ type: 'changePresetPicture', layoutId: layoutId || '', presetId: preset.id, image: null });
        presetSectionEvents.emit('onImageChange', null);
        reset(defaultValues);
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
        <HiddenInput name={'id'} register={register} />
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
