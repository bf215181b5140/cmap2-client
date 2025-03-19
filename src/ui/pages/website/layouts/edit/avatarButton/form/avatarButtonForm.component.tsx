import TypedEmitter from 'typed-emitter/rxjs';
import { EditAvatarButtonEvents } from '../editAvatarButton.model';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../../hooks/useNotifications.hook';
import React, { useContext, useEffect } from 'react';
import { LayoutsPageContext } from '../../../layouts.context';
import { AvatarButtonDTO, AvatarButtonFormDTO, AvatarButtonFormSchema, AvatarButtonSchema, getForcedItemLabel, ImageOrientationSchema } from 'cmap-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Segment from '../../../../../../components/segment/segment.component';
import HiddenInput from '../../../../../../components/input/hidden.component';
import FormTable from '../../../../../../components/form/formTable.component';
import Input from '../../../../../../components/input/input.component';
import SelectInput from '../../../../../../components/input/select.component';
import FormControlBar from '../../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../../components/buttons/iconButton.component';
import { ModalContext } from '../../../../../../components/context/modal.context';
import { useNavigate } from 'react-router-dom';
import FormControlRow from '../../../../../../components/form/formControlRow.component';
import BasicModal from '../../../../../../components/modal/basicModal/basicModal.component';

interface AvatarButtonFormProps {
  avatarButtonEvents: TypedEmitter<EditAvatarButtonEvents>;
  avatarButton: AvatarButtonDTO | undefined;
}

export default function AvatarButtonForm({ avatarButtonEvents, avatarButton }: AvatarButtonFormProps) {

  const navigate = useNavigate();
  const { POST, PUT, DELETE } = useCmapFetch();
  const { setModal } = useContext(ModalContext);
  const { addNotification } = useNotifications();
  const { interactionKeys, avatarButtons, avatarButtonsDispatch } = useContext(LayoutsPageContext);

  const defaultValue: AvatarButtonFormDTO = {
    id: null,
    label: '',
    vrcAvatarId: '',
    imageOrientation: ImageOrientationSchema.Enum.Square,
    order: (avatarButtons?.length ?? 0) + 1,
    interactionKeyId: null,
    ...avatarButton,
  };

  const { register, reset, formState: { errors, isDirty }, watch, handleSubmit } = useForm<AvatarButtonFormDTO>({
    resolver: zodResolver(AvatarButtonFormSchema),
    defaultValues: defaultValue,
  });
  const formWatch = watch();

  useEffect(() => {
    avatarButtonEvents.emit('onFormChange', { ...formWatch, id: formWatch.id || '' });
  }, [formWatch]);

  useEffect(() => {
    reset(defaultValue);
  }, [avatarButton]);

  const isNew = !defaultValue.id;

  function onSubmit(formData: AvatarButtonFormDTO) {
    if (isNew) {
      PUT('layouts/avatarButton', formData, AvatarButtonSchema, data => {
        avatarButtonsDispatch({ type: 'add', avatarButton: data });
        addNotification('Success', 'New avatar added.');
        avatarButtonEvents.emit('onSaved', data);
        navigate(`/website/layouts/`);
      });
    } else {
      POST('layouts/avatarButton', formData, AvatarButtonSchema, data => {
        avatarButtonsDispatch({ type: 'edit', avatarButton: data });
        avatarButtonEvents.emit('onSaved', data);
        navigate(`/website/layouts/`);
      });
    }
  }

  function onCopy() {
    if (!avatarButton?.id) return;
    setModal(<BasicModal title={`Copying avatar button ${getForcedItemLabel(avatarButton, 'avatar')}`} message={'You are about to make a copy of this avatar button.'} confirmFunction={() => {
      POST('layouts/avatarButton/copy', { id: avatarButton.id }, AvatarButtonSchema, data => {
        avatarButtonsDispatch({ type: 'add', avatarButton: data });
        addNotification('Success', 'Avatar button copy was created.');
      });
    }} />);
  }

  function onDelete() {
    if (!avatarButton?.id) return;
    DELETE('layouts/avatarButton', { id: avatarButton.id }, undefined, () => {
      avatarButtonsDispatch({ type: 'remove', avatarButton: avatarButton });
      addNotification('Success', 'Avatar button was deleted.');
      navigate(`/website/layouts/`);
    });
  }

  return (<Segment segmentTitle={isNew ? 'New avatar button' : 'Edit avatar button'} width={'2'}>

    <form onSubmit={handleSubmit(onSubmit)}>
      <HiddenInput register={register} name={'id'} />
      <HiddenInput register={register} name={'order'} />
      <FormTable visible={true}>
        <tr>
          <th style={{ width: '125px' }}>Label</th>
          <td><Input register={register} name={'label'} width={'300px'} errors={errors} /></td>
        </tr>
        <tr>
          <th>VRChat avatar ID</th>
          <td><Input register={register} name={'vrcAvatarId'} width={'470px'} errors={errors} /></td>
        </tr>
        <tr>
          <th>Image orientation</th>
          <td>
            <SelectInput options={ImageOrientationSchema.options.map(o => ({ key: o, value: o }))} register={register} name={'imageOrientation'} errors={errors} />
          </td>
        </tr>
        <tr>
          <th>Interaction key</th>
          <td>
            <SelectInput options={[{ key: '', value: '' }, ...interactionKeys.map(k => ({ key: k.id, value: k.label }))]} register={register} name={'interactionKeyId'} errors={errors} />
          </td>
        </tr>
        <FormControlRow colSpan={2}>
          <IconButton role={'save'} disabled={!isDirty} />
          <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
        </FormControlRow>
      </FormTable>
      <FormControlBar>
        <IconButton role={'normal'} size={'small'} tooltip={'Create a copy'} icon={'ri-file-copy-line'} onClick={() => onCopy()} disabled={!avatarButton?.id} />
        <hr />
        <IconButton role={'delete'} size={'small'} tooltip={'Delete avatar button'} deleteKeyword={'avatar button'} onClick={() => onDelete()} disabled={!avatarButton?.id} />
      </FormControlBar>
    </form>
  </Segment>);
}
