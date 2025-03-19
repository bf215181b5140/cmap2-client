import { EditParameterButtonEvents } from '../editParameterButton.model';
import TypedEmitter from 'typed-emitter/rxjs';
import { useNavigate } from 'react-router-dom';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../../hooks/useNotifications.hook';
import { useContext, useEffect } from 'react';
import { LayoutsPageContext } from '../../../layouts.context';
import { GroupDTO, ImageOrientationSchema, LayoutDTO, ParameterButtonDTO, ParameterButtonFormDTO, ParameterButtonFormSchema, ParameterButtonSchema, ParameterButtonTypeSchema, VisibilityParameterConditionSchema } from 'cmap-shared';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Segment from '../../../../../../components/segment/segment.component';
import HiddenInput from '../../../../../../components/input/hidden.component';
import FormTable, { FormTableStyled } from '../../../../../../components/form/formTable.component';
import Input from '../../../../../../components/input/input.component';
import ParameterInput from '../../../../../../components/input/parameterInput/parameterInput.component';
import SelectInput from '../../../../../../components/input/select.component';
import NumberInput from '../../../../../../components/input/number.component';
import FormRemoveRow from '../../../../../../components/form/removeRow/formRemoveRow.component';
import FormAddRow from '../../../../../../components/form/addRow/formAddRow.component';
import FormControlBar from '../../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../../components/buttons/iconButton.component';
import FormControlRow from '../../../../../../components/form/formControlRow.component';
import ParameterButtonCopyModal from '../copyModal/parameterButtonCopyModal.component';
import { ModalContext } from '../../../../../../components/context/modal.context';

interface ParameterButtonFormProps {
  parameterButtonEvents: TypedEmitter<EditParameterButtonEvents>;
  layout: LayoutDTO;
  group: GroupDTO;
  parameterButton: ParameterButtonDTO | undefined;
}

export default function ParameterButtonForm({ parameterButtonEvents, layout, group, parameterButton }: ParameterButtonFormProps) {

  const navigate = useNavigate();
  const { POST, PUT, DELETE } = useCmapFetch();
  const { setModal } = useContext(ModalContext);
  const { addNotification } = useNotifications();
  const { tier, interactionKeys, layouts, layoutsDispatch } = useContext(LayoutsPageContext);

  const defaultValue: ParameterButtonFormDTO = {
    groupId: group.id,
    id: null,
    label: '',
    path: '',
    value: '' as any,
    valueAlt: null,
    buttonType: ParameterButtonTypeSchema.Enum.Button,
    imageOrientation: ImageOrientationSchema.Enum.Square,
    order: (group?.parameterButtons?.length ?? 0) + 1,
    useCost: null,
    callbackParameters: [],
    visibilityParameters: [],
    interactionKeyId: null,
    ...parameterButton,
  };

  const { register, setValue, reset, formState: { errors, isDirty }, control, watch, handleSubmit } = useForm<ParameterButtonFormDTO>({
    resolver: zodResolver(ParameterButtonFormSchema),
    defaultValues: defaultValue,
  });
  const callbackParameters = useFieldArray({ control, name: 'callbackParameters' });
  const visibilityParameters = useFieldArray({ control, name: 'visibilityParameters' });
  const formWatch = watch();

  useEffect(() => {
    parameterButtonEvents.emit('onFormChange', { ...formWatch, id: formWatch.id || '' });
  }, [formWatch]);

  useEffect(() => {
    reset(defaultValue);
  }, [parameterButton]);

  const isNew = !defaultValue.id;

  function onSubmit(formData: ParameterButtonFormDTO) {
    if (isNew) {
      PUT('layouts/parameterButton', formData, ParameterButtonSchema, data => {
        layoutsDispatch({ type: 'addParameterButton', layoutId: layout.id, groupId: group.id, parameterButton: data });
        addNotification('Success', 'New button added.');
        parameterButtonEvents.emit('onSaved', data);
        navigate(`/website/layouts/${layout.id}`);
      });
    } else {
      POST('layouts/parameterButton', formData, ParameterButtonSchema, data => {
        layoutsDispatch({ type: 'editParameterButton', layoutId: layout.id, groupId: group.id, parameterButton: data });
        addNotification('Success', 'Button saved.');
        parameterButtonEvents.emit('onSaved', data);
        navigate(`/website/layouts/${layout.id}`);
      });
    }
  }

  function onCopy() {
    if (!parameterButton?.id) return;
    setModal(<ParameterButtonCopyModal layouts={layouts} parameterButton={parameterButton}
                                       onSuccess={(layoutId, groupId, parameterButton) => layoutsDispatch({ type: 'addParameterButton', layoutId, groupId, parameterButton })} />);
  }

  function onDelete() {
    if (!parameterButton?.id) return;
    DELETE('layouts/parameterButton', { id: parameterButton.id }, undefined, () => {
      layoutsDispatch({ type: 'removeParameterButton', layoutId: layout.id, groupId: group.id, parameterButtonId: parameterButton.id });
      addNotification('Success', 'Button was deleted.');
      navigate(`/website/layouts/${layout.id}`);
    });
  }

  function valuePrimaryPlaceholder(): string {
    switch (formWatch.buttonType) {
      case ParameterButtonTypeSchema.Enum.Button:
        return 'Value';
      case ParameterButtonTypeSchema.Enum.Toggle:
        return 'Active value';
      case ParameterButtonTypeSchema.Enum.Slider:
        return 'Minimum value';
    }
  }

  function valueSecondaryPlaceholder(): string {
    switch (formWatch.buttonType) {
      case ParameterButtonTypeSchema.Enum.Button:
        return '';
      case ParameterButtonTypeSchema.Enum.Toggle:
        return 'Inactive value';
      case ParameterButtonTypeSchema.Enum.Slider:
        return 'Maximum value';
    }
  }

  return (<Segment segmentTitle={isNew ? 'New button' : 'Edit button'} width={'2'}>

    <form onSubmit={handleSubmit(onSubmit)}>
      <HiddenInput register={register} name={'groupId'} />
      <HiddenInput register={register} name={'id'} />
      <HiddenInput register={register} name={'order'} />
      <FormTable visible={true}>
        <tr>
          <th style={{ width: '125px' }}>Label</th>
          <td><Input register={register} name={'label'} width={'300px'} errors={errors} /></td>
        </tr>
        <tr>
          <th>Parameter</th>
          <td>
            <ParameterInput register={register} name={'path'} errors={errors} setValue={setValue} defaultAvatarVrcId={layout?.avatars.at(0)} defaultType={'input'} />
          </td>
        </tr>
        <tr>
          <th rowSpan={2}>Values</th>
          <td>
            <Input register={register} name={'value'} placeholder={valuePrimaryPlaceholder()} width={'100px'} errors={errors} />
          </td>
        </tr>
        <tr>
          <td>
            <Input register={register} name={'valueAlt'} placeholder={valueSecondaryPlaceholder()} width={'100px'} errors={errors}
                   readOnly={formWatch.buttonType !== ParameterButtonTypeSchema.Enum.Slider && formWatch.buttonType !== ParameterButtonTypeSchema.Enum.Toggle} />
          </td>
        </tr>
        <tr>
          <th>Button type</th>
          <td>
            <SelectInput options={ParameterButtonTypeSchema.options.map(t => ({ key: t, value: t }))} register={register} name={'buttonType'} errors={errors} />
          </td>
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
        <IconButton role={'normal'} size={'small'} tooltip={'Create a copy'} icon={'ri-file-copy-line'} disabled={!parameterButton?.id} onClick={onCopy} />
        <hr />
        <IconButton role={'delete'} size={'small'} tooltip={'Delete button'} deleteKeyword={'button'} disabled={!parameterButton?.id} onClick={onDelete} />
      </FormControlBar>
    </form>
  </Segment>);
}
