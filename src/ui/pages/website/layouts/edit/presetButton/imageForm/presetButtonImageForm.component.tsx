import TypedEmitter from 'typed-emitter/rxjs';
import { RefObject, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { LayoutDTO, PresetButtonDTO, UploadedFileSchema } from 'cmap2-shared';
import styled from 'styled-components';
import { EditPresetButtonEvents } from '../editPresetButton.model';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import useFileValidation from '../../../../../../hooks/fileValidation.hook';
import { LayoutsPageContext } from '../../../layouts.context';
import Segment from '../../../../../../components/segment/segment.component';
import IconButton from '../../../../../../components/buttons/iconButton.component';
import FormControlBar from '../../../../../../components/form/formControlBar.component';

interface PresetButtonImageFormProps {
  presetButtonEvents: TypedEmitter<EditPresetButtonEvents>;
  layout: LayoutDTO;
  presetButton: PresetButtonDTO | undefined;
}

interface PresetButtonImageForm {
  id: string
  file: FileList | null,
}

export default function PresetButtonImageForm({ presetButtonEvents, layout, presetButton }: PresetButtonImageFormProps) {

  const { cmapFetch, DELETE } = useCmapFetch();
  const { validateImage } = useFileValidation();
  const { layoutsDispatch } = useContext(LayoutsPageContext);

  const defaultValues: PresetButtonImageForm = { file: null, id: presetButton?.id || '' };

  const { register, setValue, watch, reset, handleSubmit } = useForm<PresetButtonImageForm>({ defaultValues });
  const { ref, ...fileRegister } = register('file');
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const submitRef: RefObject<HTMLInputElement> = useRef(null);
  const id = watch('id');
  const file = watch('file')?.item(0);

  useImperativeHandle(ref, () => inputRef.current);

  useEffect(() => {
    function onPresetSaved(savedPreset: PresetButtonDTO) {
      setValue('id', savedPreset.id);
      submitRef.current?.click();
    }

    presetButtonEvents.on('onSaved', onPresetSaved);

    return () => {
      presetButtonEvents.removeListener('onSaved', onPresetSaved);
    };
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [presetButton]);

  useEffect(() => {
    if (file) {
      validateImage(file,
        () => {
          if (id) {
            submitRef.current?.click();
          } else {
            presetButtonEvents.emit('onImageChange', { id: '', fileName: file.name, urlPath: URL.createObjectURL(file) });
          }
        },
        () => {
          presetButtonEvents.emit('onImageChange', null);
          reset(defaultValues);
        });
    }
  }, [file]);

  function onSubmit(formData: PresetButtonImageForm) {
    if (formData.file?.[0] && formData?.id) {
      const postData = new FormData();
      postData.append('file', formData.file[0]);
      postData.append('id', formData.id);

      cmapFetch('layouts/presetButton/image', { method: 'POST', body: postData }, UploadedFileSchema, data => {
        layoutsDispatch({ type: 'changePresetButtonPicture', layoutId: layout.id, presetButtonId: formData.id, image: data });
        reset(defaultValues);
      });
    }
  }

  function onClear() {
    if (file) {
      presetButtonEvents.emit('onImageChange', null);
      reset(defaultValues);
    } else if (presetButton?.image) {
      DELETE('layouts/presetButton/image', { id: presetButton.id }, undefined, () => {
        layoutsDispatch({ type: 'changePresetButtonPicture', layoutId: layout.id, presetButtonId: presetButton.id, image: null });
        presetButtonEvents.emit('onImageChange', null);
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
      <IconButton  role={'remove'} tooltip={'Remove image'} onClick={onClear} disabled={!file && !presetButton?.image} />
    </FormControlBar>

    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'none' }}>
      <input type="file" {...fileRegister} ref={inputRef} />
      <input type="submit" ref={submitRef} />
    </form>

  </Segment>);
}
