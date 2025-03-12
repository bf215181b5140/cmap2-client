import { EditParameterButtonEvents } from '../editParameterButton.model';
import TypedEmitter from 'typed-emitter/rxjs';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import useFileValidation from '../../../../../../hooks/fileValidation.hook';
import { RefObject, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { LayoutsPageContext } from '../../../layouts.context';
import { useForm } from 'react-hook-form';
import { GroupDTO, LayoutDTO, ParameterButtonDTO, UploadedFileSchema } from 'cmap2-shared';
import Segment from '../../../../../../components/segment/segment.component';
import IconButton from '../../../../../../components/buttons/iconButton.component';
import FormControlBar from '../../../../../../components/form/formControlBar.component';

interface ParameterButtonImageFormProps {
  parameterButtonEvents: TypedEmitter<EditParameterButtonEvents>;
  layout: LayoutDTO;
  group: GroupDTO;
  parameterButton: ParameterButtonDTO | undefined;
}

interface ParameterButtonImageForm {
  id: string
  file: FileList | null,
}

export default function ParameterButtonImageForm({ parameterButtonEvents, layout, group, parameterButton }: ParameterButtonImageFormProps) {

  const { cmapFetch, DELETE } = useCmapFetch();
  const { validateImage } = useFileValidation();
  const { layoutsDispatch } = useContext(LayoutsPageContext);

  const defaultValues: ParameterButtonImageForm = { file: null, id: parameterButton?.id || '' };

  const { register, setValue, watch, reset, handleSubmit } = useForm<ParameterButtonImageForm>({ defaultValues });
  const { ref, ...fileRegister } = register('file');
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const submitRef: RefObject<HTMLInputElement> = useRef(null);
  const id = watch('id');
  const file = watch('file')?.item(0);

  useImperativeHandle(ref, () => inputRef.current);

  useEffect(() => {
    function onButtonSaved(savedButton: ParameterButtonDTO) {
      setValue('id', savedButton.id);
      submitRef.current?.click();
    }

    parameterButtonEvents.on('onSaved', onButtonSaved);

    return () => {
      parameterButtonEvents.removeListener('onSaved', onButtonSaved);
    };
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [parameterButton]);

  useEffect(() => {
    if (file) {
      validateImage(file,
        () => {
          if (id) {
            submitRef.current?.click();
          } else {
            parameterButtonEvents.emit('onImageChange', { id: '', fileName: file.name, urlPath: URL.createObjectURL(file) });
          }
        },
        () => {
          parameterButtonEvents.emit('onImageChange', null);
          reset(defaultValues);
        });
    }
  }, [file]);

  function onSubmit(formData: ParameterButtonImageForm) {
    if (formData.file?.[0] && formData.id) {
      const postData = new FormData();
      postData.append('file', formData.file[0]);
      postData.append('id', formData.id);

      cmapFetch('layouts/parameterButton/image', { method: 'POST', body: postData }, UploadedFileSchema, data => {
        layoutsDispatch({ type: 'changeParameterButtonPicture', layoutId: layout.id, groupId: group.id, parameterButtonId: formData.id, image: data });
        reset(defaultValues);
      });
    }
  }

  function onClear() {
    if (file) {
      parameterButtonEvents.emit('onImageChange', null);
      reset(defaultValues);
    } else if (parameterButton?.image) {
      DELETE('layouts/parameterButton/image', { id: parameterButton.id }, undefined, () => {
        layoutsDispatch({ type: 'changeParameterButtonPicture', layoutId: layout.id, groupId: group.id, parameterButtonId: parameterButton.id, image: null });
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
        <IconButton  role={'remove'} tooltip={'Remove image'} onClick={onClear} disabled={!file && !parameterButton?.image} />
      </FormControlBar>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'none' }}>
        <input type="file" {...fileRegister} ref={inputRef} />
        <input type="submit" ref={submitRef} />
      </form>

  </Segment>);
}
