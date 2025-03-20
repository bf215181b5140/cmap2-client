import TypedEmitter from 'typed-emitter/rxjs';
import { EditPresetButtonEvents } from '../editPresetButton.model';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../../hooks/useNotifications.hook';
import React, { useContext, useEffect } from 'react';
import { LayoutsPageContext } from '../../../layouts.context';
import { ImageOrientationSchema, LayoutDTO, PresetButtonDTO, PresetButtonFormDTO, PresetButtonFormSchema, PresetButtonSchema, VisibilityParameterConditionSchema } from 'cmap-shared';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Segment from '../../../../../../components/segment/segment.component';
import HiddenInput from '../../../../../../components/input/hidden.component';
import FormTable, { FormTableStyled } from '../../../../../../components/form/formTable.component';
import Input from '../../../../../../components/input/input.component';
import SelectInput from '../../../../../../components/input/select.component';
import NumberInput from '../../../../../../components/input/number.component';
import ParameterInput from '../../../../../../components/input/parameterInput/parameterInput.component';
import FormRemoveRow from '../../../../../../components/form/removeRow/formRemoveRow.component';
import FormAddRow from '../../../../../../components/form/addRow/formAddRow.component';
import FormControlBar from '../../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../../components/buttons/iconButton.component';
import { ModalContext } from '../../../../../../components/context/modal.context';
import PresetButtonCopyModal from '../copyModal/presetButtonCopyModal.component';
import { useNavigate } from 'react-router-dom';
import FormControlRow from '../../../../../../components/form/formControlRow.component';

interface PresetButtonFormProps {
  presetButtonEvents: TypedEmitter<EditPresetButtonEvents>;
  layout: LayoutDTO;
  presetButton: PresetButtonDTO | undefined;
}

export default function PresetButtonForm({ presetButtonEvents, layout, presetButton }: PresetButtonFormProps) {

  const navigate = useNavigate();
  const { POST, PUT, DELETE } = useCmapFetch();
  const { setModal } = useContext(ModalContext);
  const { addNotification } = useNotifications();
  const { tier, interactionKeys, layouts, layoutsDispatch } = useContext(LayoutsPageContext);

  const defaultValue: PresetButtonFormDTO = {
    layoutId: layout.id,
    id: null,
    label: '',
    parameters: [],
    imageOrientation: ImageOrientationSchema.Enum.Square,
    order: (layout.presetButtons?.length ?? 0) + 1,
    useCost: null,
    callbackParameters: [],
    visibilityParameters: [],
    interactionKeyId: null,
    ...presetButton,
  };

  const { register, setValue, reset, formState: { errors, isDirty }, control, watch, handleSubmit } = useForm<PresetButtonFormDTO>({
    resolver: zodResolver(PresetButtonFormSchema),
    defaultValues: defaultValue,
  });
  const parameters = useFieldArray({ control, name: 'parameters' });
  const callbackParameters = useFieldArray({ control, name: 'callbackParameters' });
  const visibilityParameters = useFieldArray({ control, name: 'visibilityParameters' });
  const formWatch = watch();

  useEffect(() => {
    presetButtonEvents.emit('onFormChange', { ...formWatch, id: formWatch.id || '' });
  }, [formWatch]);

  useEffect(() => {
    reset(defaultValue);
  }, [presetButton]);

  const isNew = !defaultValue.id;

  function onSubmit(formData: PresetButtonFormDTO) {
    if (isNew) {
      PUT('layouts/presetButton', formData, PresetButtonSchema, data => {
        layoutsDispatch({ type: 'addPresetButton', layoutId: layout.id, presetButton: data });
        addNotification('Success', 'New preset added.');
        presetButtonEvents.emit('onSaved', data);
        navigate(`/website/layouts/${layout.id}`);
      });
    } else {
      POST('layouts/presetButton', formData, PresetButtonSchema, data => {
        layoutsDispatch({ type: 'editPresetButton', layoutId: layout.id, presetButton: data });
        presetButtonEvents.emit('onSaved', data);
        navigate(`/website/layouts/${layout.id}`);
      });
    }
  }

  function onCopy() {
    if (!presetButton?.id) return;
    setModal(<PresetButtonCopyModal layouts={layouts} layout={layout} presetButton={presetButton}
                                    onSuccess={(layoutId, preset) => layoutsDispatch({ type: 'addPresetButton', layoutId, presetButton: preset })} />);
  }

  function onDelete() {
    if (!presetButton?.id) return;
    DELETE('layouts/presetButton', { id: presetButton.id }, undefined, () => {
      layoutsDispatch({ type: 'removePresetButton', layoutId: layout.id, presetButtonId: presetButton.id });
      addNotification('Success', 'Preset was deleted.');
      navigate(`/website/layouts/${layout.id}`);
    });
  }

  return (<Segment segmentTitle={isNew ? 'New preset' : 'Edit preset'} width={'2'}>

    <form onSubmit={handleSubmit(onSubmit)}>
      <HiddenInput register={register} name={'layoutId'} />
      <HiddenInput register={register} name={'id'} />
      <HiddenInput register={register} name={'order'} />
      <FormTable visible={true}>
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
        <tr>
          <th style={{ width: '120px' }}>Interaction key</th>
          <td>
            <SelectInput options={[{ key: '', value: '' }, ...interactionKeys.map(k => ({ key: k.id, value: k.label }))]} register={register} name={'interactionKeyId'} errors={errors} />
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
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
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <fieldset>
              <legend>Additional parameters</legend>
              <p>You can send out additional parameter commands after button clicks. These can be delayed by specifying <b>Seconds</b> field, 0 will send it immediately.</p>
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
                      <ParameterInput register={register} name={`callbackParameters.${index}.path`} defaultAvatarVrcId={layout?.avatars.at(0)} defaultType={'input'} setValue={setValue}
                                      errors={errors} />
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
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <fieldset>
              <legend>Visibility parameters</legend>
              <p>You can set button visibility based on specific avatar parameter values. Button will only be visible if at least one parameter matches the condition
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
                      <ParameterInput register={register} name={`visibilityParameters.${index}.path`} defaultAvatarVrcId={layout?.avatars.at(0)} defaultType={'input'} setValue={setValue}
                                      errors={errors} />
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
          </td>
        </tr>
        <FormControlRow colSpan={2}>
          <IconButton role={'save'} disabled={!isDirty} />
          <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
        </FormControlRow>
      </FormTable>
      <FormControlBar>
        <IconButton role={'normal'} size={'small'} tooltip={'Create a copy'} icon={'ri-file-copy-line'} onClick={() => onCopy()} disabled={!presetButton?.id} />
        <hr />
        <IconButton role={'delete'} size={'small'} tooltip={'Delete preset'} deleteKeyword={'preset'} onClick={() => onDelete()} disabled={!presetButton?.id} />
      </FormControlBar>
    </form>
  </Segment>);
}
