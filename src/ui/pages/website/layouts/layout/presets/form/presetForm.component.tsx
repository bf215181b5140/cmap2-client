import TypedEmitter from 'typed-emitter/rxjs';
import { PresetsSectionEvents } from '../presets.model';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../../hooks/useNotifications.hook';
import React, { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { LayoutsPageContext } from '../../../layouts.context';
import { ParameterButtonDTO, ImageOrientationSchema, PresetButtonDTO, PresetButtonFormDTO, PresetButtonFormSchema, PresetButtonSchema, VisibilityParameterConditionSchema } from 'cmap2-shared';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Segment from '../../../../../../components/segment/segment.component';
import HiddenInput from '../../../../../../components/input/hidden.component';
import FormTable, { FormTableStyled } from '../../../../../../components/form/formTable.component';
import Input from '../../../../../../components/input/input.component';
import CheckboxInput from '../../../../../../components/input/checkbox.component';
import SelectInput from '../../../../../../components/input/select.component';
import NumberInput from '../../../../../../components/input/number.component';
import ParameterInput from '../../../../../../components/input/parameterInput/parameterInput.component';
import FormRemoveRow from '../../../../../../components/form/removeRow/formRemoveRow.component';
import FormAddRow from '../../../../../../components/form/addRow/formAddRow.component';
import FormControlBar from '../../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../../components/buttons/iconButton.component';
import ButtonCopyModal from '../../preview/quickEditToolbar/buttonCopyModal/buttonCopyModal.component';
import { ModalContext } from '../../../../../../components/context/modal.context';
import PresetCopyModal from '../copyModal/presetCopyModal.component';

interface PresetFormProps {
  presetSectionEvents: TypedEmitter<PresetsSectionEvents>;
  preset: PresetButtonDTO;
  setSelectedPreset: Dispatch<SetStateAction<PresetButtonDTO | undefined>>;
}

export default function PresetForm({ presetSectionEvents, preset, setSelectedPreset }: PresetFormProps) {

  const { POST, PUT, DELETE } = useCmapFetch();
  const { addNotification } = useNotifications();
  const { setModal } = useContext(ModalContext);
  const { tier, interactionKeys, layoutsDispatch, layoutId, layout, layouts } = useContext(LayoutsPageContext);

  const defaultFormValue: PresetButtonFormDTO = {
    layoutId: layoutId || '',
    ...preset,
    id: preset.id || null
  };

  const isNew = !defaultFormValue.id;

  const { register, setValue, reset, formState: { errors, isDirty }, control, watch, handleSubmit } = useForm<PresetButtonFormDTO>({
    resolver: zodResolver(PresetButtonFormSchema),
    defaultValues: defaultFormValue,
  });
  const parameters = useFieldArray({ control, name: 'parameters' });
  const callbackParameters = useFieldArray({ control, name: 'callbackParameters' });
  const visibilityParameters = useFieldArray({ control, name: 'visibilityParameters' });
  const formWatch = watch();

  presetSectionEvents.emit('onFormChange', { ...formWatch, id: formWatch.id || '' });

  useEffect(() => {
    reset(defaultFormValue);
  }, [preset]);

  function onSubmit(formData: PresetButtonFormDTO) {
    if (isNew) {
      PUT('layouts/preset', formData, PresetButtonSchema, data => {
        layoutsDispatch({ type: 'addPreset', layoutId: layoutId || '', preset: data });
        addNotification('Success', 'New preset added.');
        presetSectionEvents.emit('onSaved', data);
        setSelectedPreset(undefined);
      });
    } else {
      POST('layouts/preset', formData, PresetButtonSchema, data => {
        layoutsDispatch({ type: 'editPreset', layoutId: layoutId || '', preset: data });
        presetSectionEvents.emit('onSaved', data);
        reset({ ...formData, ...data });
      });
    }
  }

  function onDelete() {
    const presetId = formWatch.id;
    if (!presetId) return;
    DELETE('layouts/preset', { id: presetId }, undefined, () => {
      layoutsDispatch({ type: 'removePreset', layoutId: layoutId || '', presetId: presetId });
      addNotification('Success', 'Preset was deleted.');
      setSelectedPreset(undefined);
    });
  }

  function onCopy() {
    if (isNew || !layout) return;
    setModal(<PresetCopyModal layouts={layouts} layout={layout} preset={preset} onSuccess={(layoutId, preset) => layoutsDispatch({ type: 'addPreset', layoutId, preset })} />);
  }

  // function setPresetPicture(file: UploadedFileDTO | null) {
  //   layoutsDispatch({ type: 'changePresetPicture', layoutId: layoutId || '', groupId: groupId || '', presetId: preset.id, image: file });
  //   preset.image = file;
  //   setPreviewImage(file);
  // }

  // function setLocalPresetPicture(file?: File | null) {
  //   if (file) {
  //     setPreviewImage({ fileName: file.name, urlPath: URL.createObjectURL(file) });
  //   } else {
  //     setPreviewImage(preset.image);
  //   }
  // }

  return (<Segment segmentTitle={isNew ? 'New preset' : 'Edit preset'} width={'2'}>

    <form onSubmit={handleSubmit(onSubmit)}>
      <HiddenInput register={register} name={'layoutId'} />
      <HiddenInput register={register} name={'id'} />
      <HiddenInput register={register} name={'order'} />
      <FormTable>
        <tr>
          <th style={{ width: '130px' }}>Label</th>
          <td><Input register={register} name={'label'} width={'300px'} errors={errors} /></td>
        </tr>
        <tr>
          <th>Image orientation</th>
          <td>
            <SelectInput options={ImageOrientationSchema.options.map(o => ({ key: o, value: o }))} register={register} name={'imageOrientation'} errors={errors} />
          </td>
        </tr>
        <tr>
          <th>Use cost</th>
          <td>
            <NumberInput register={register} name={'useCost'} errors={errors} width={'100px'} readOnly={!tier.useCost} />
          </td>
        </tr>
      </FormTable>
      <fieldset>
        <legend>Parameters</legend>
        <p>List all parameters that should be set using this preset.</p>
        <FormTableStyled>
          {parameters.fields.length > 0 && <thead>
          <tr>
            <th>Parameter</th>
            <th style={{ width: '75px' }}>Value</th>
            <th></th>
          </tr>
          </thead>}
          <tbody>
          {parameters.fields.map((item, index) => (
            <tr key={index}>
              <td>
                <ParameterInput register={register} name={`parameters.${index}.path`} defaultAvatarVrcId={layout?.avatars.at(0)} defaultType={'input'} setValue={setValue} errors={errors} />
              </td>
              <td>
                <Input register={register} name={`parameters.${index}.value`} errors={errors} />
              </td>
              <FormRemoveRow onClick={() => parameters.remove(index)} />
            </tr>
          ))}
          <tr>
            <FormAddRow colSpan={3} items={parameters.fields.length} limit={tier.presetButtonParameters} onClick={() => parameters.append({ path: '', value: '' as unknown as number })} />
          </tr>
          </tbody>
        </FormTableStyled>
      </fieldset>
      <fieldset>
        <legend>Additional parameters</legend>
        <p>You can send out additional parameter commands after preset clicks. These can be delayed by specifying <b>Seconds</b> field, 0 will send it immediately.</p>
        <FormTableStyled>
          {callbackParameters.fields.length > 0 && <thead>
          <tr>
            <th>Parameter</th>
            <th style={{ width: '75px' }}>Value</th>
            <th style={{ width: '75px' }}>Seconds</th>
            <th></th>
          </tr>
          </thead>}
          <tbody>
          {callbackParameters.fields.map((item, index) => (
            <tr key={index}>
              <td>
                <ParameterInput register={register} name={`callbackParameters.${index}.path`} defaultAvatarVrcId={layout?.avatars.at(0)} defaultType={'input'} setValue={setValue} errors={errors} />
              </td>
              <td>
                <Input register={register} name={`callbackParameters.${index}.value`} errors={errors} />
              </td>
              <td>
                <NumberInput register={register} name={`callbackParameters.${index}.seconds`} decimals={0} errors={errors} />
              </td>
              <FormRemoveRow onClick={() => callbackParameters.remove(index)} />
            </tr>
          ))}
          <tr>
            <FormAddRow colSpan={3} items={callbackParameters.fields.length} limit={tier.callbackParameters} onClick={() => callbackParameters.append({ path: '', value: 0, seconds: 0 })} />
          </tr>
          </tbody>
        </FormTableStyled>
      </fieldset>
      <fieldset>
        <legend>Visibility parameters</legend>
        <p>You can set preset visibility based on specific avatar parameter values. Preset will only be visible if at least one parameter matches the condition
          specified.</p>
        <FormTableStyled>
          {visibilityParameters.fields.length > 0 && <thead>
          <tr>
            <th>Parameter</th>
            <th style={{ width: '75px' }}>Value</th>
            <th style={{ width: '120px' }}>Condition</th>
            <th></th>
          </tr>
          </thead>}
          <tbody>
          {visibilityParameters.fields.map((item, index) => (
            <tr key={index}>
              <td>
                <ParameterInput register={register} name={`visibilityParameters.${index}.path`} defaultAvatarVrcId={layout?.avatars.at(0)} defaultType={'input'} setValue={setValue} errors={errors} />
              </td>
              <td>
                <Input register={register} name={`visibilityParameters.${index}.value`} errors={errors} />
              </td>
              <td>
                <SelectInput options={VisibilityParameterConditionSchema.options.map(c => ({ key: c, value: c.replace('_', ' ') }))} register={register}
                             name={`visibilityParameters.${index}.condition`} width={'100%'} errors={errors} />
              </td>
              <FormRemoveRow onClick={() => visibilityParameters.remove(index)} />
            </tr>
          ))}
          <tr>
            <FormAddRow colSpan={3} items={visibilityParameters.fields.length} limit={tier.visibilityParameters}
                        onClick={() => visibilityParameters.append({ path: '', value: '' as any, condition: 'Equal' })} />
          </tr>
          </tbody>
        </FormTableStyled>
      </fieldset>
      <FormTable>
        <tr>
          <th style={{ width: '120px' }}>Interaction key</th>
          <td>
            <SelectInput options={[{ key: '', value: '' }, ...interactionKeys.map(k => ({ key: k.id, value: k.label }))]} register={register} name={'interactionKeyId'} errors={errors} />
          </td>
        </tr>
      </FormTable>

      <FormControlBar>
        <IconButton role={'normal'} size={'small'} tooltip={'Create a copy'} icon={'ri-file-copy-line'} onClick={() => onCopy()} disabled={isNew} />
        <hr />
        <IconButton role={'save'} disabled={!isDirty} />
        <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
        <hr />
        <IconButton role={'delete'} deleteKeyword={'preset'} size={'small'} onClick={() => onDelete()} disabled={!formWatch.id} />
      </FormControlBar>

    </form>
  </Segment>);
}
