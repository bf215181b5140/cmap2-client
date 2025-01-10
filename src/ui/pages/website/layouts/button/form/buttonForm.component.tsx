import { ButtonSectionEvents } from '../button.model';
import TypedEmitter from 'typed-emitter/rxjs';
import { useNavigate } from 'react-router-dom';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../hooks/useNotifications.hook';
import { useContext, useEffect } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import { ButtonFormDTO, ButtonFormSchema, ButtonSchema, ButtonTypeSchema, ImageOrientationSchema, VisibilityParameterConditionSchema } from 'cmap2-shared';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Segment from '../../../../../components/segment/segment.component';
import HiddenInput from '../../../../../components/input/hidden.component';
import FormTable, { FormTableStyled } from '../../../../../components/form/formTable.component';
import Input from '../../../../../components/input/input.component';
import CheckboxInput from '../../../../../components/input/checkbox.component';
import ParameterInput from '../../../../../components/input/parameterInput/parameterInput.component';
import SelectInput from '../../../../../components/input/select.component';
import NumberInput from '../../../../../components/input/number.component';
import FormRemoveRow from '../../../../../components/form/removeRow/formRemoveRow.component';
import FormAddRow from '../../../../../components/form/addRow/formAddRow.component';
import FormControlBar from '../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../components/buttons/iconButton.component';

interface ButtonFormProps {
  buttonSectionEvents: TypedEmitter<ButtonSectionEvents>;
}

export default function ButtonForm({ buttonSectionEvents }: ButtonFormProps) {

  const navigate = useNavigate();
  const { POST, PUT } = useCmapFetch();
  const { addNotification } = useNotifications();
  const { tier, interactionKeys, layoutsDispatch, layoutId, groupId, layout, group, button } = useContext(LayoutsPageContext);

  const defaultValue: ButtonFormDTO = {
    groupId: groupId || '',
    id: null,
    label: '',
    showLabel: false,
    path: '',
    value: '',
    valueAlt: '',
    buttonType: ButtonTypeSchema.Enum.Button,
    imageOrientation: ImageOrientationSchema.Enum.Square,
    order: (group?.buttons?.length ?? 0) + 1,
    useCost: null,
    callbackParameters: [],
    visibilityParameters: [],
    interactionKeyId: null,
    ...button,
  };

  const { register, setValue, reset, formState: { errors, isDirty }, control, watch, handleSubmit } = useForm<ButtonFormDTO>({
    resolver: zodResolver(ButtonFormSchema),
    defaultValues: defaultValue,
  });
  const callbackParameters = useFieldArray({ control, name: 'callbackParameters' });
  const visibilityParameters = useFieldArray({ control, name: 'visibilityParameters' });
  const formWatch = watch();

  buttonSectionEvents.emit('onFormChange', { ...formWatch, id: formWatch.id || '' });

  useEffect(() => {
    reset(defaultValue);
  }, [button]);

  const isNew = !defaultValue.id;

  function onSubmit(formData: ButtonFormDTO) {
    if (isNew) {
      PUT('layouts/button', formData, ButtonSchema, data => {
        layoutsDispatch({ type: 'addButton', layoutId: layoutId || '', groupId: groupId || '', button: data });
        addNotification('Success', 'New button added.');
        buttonSectionEvents.emit('onButtonSaved', data);
        navigate(-1);
        // reset(data);
        // navigate(`/website/layouts/${layoutId}/${groupId}/${data.id}`);
      });
    } else {
      POST('layouts/button', formData, ButtonSchema, data => {
        layoutsDispatch({ type: 'editButton', layoutId: layoutId || '', groupId: groupId || '', button: data });
        buttonSectionEvents.emit('onButtonSaved', data);
        navigate(-1);
        // reset(data);
      });
    }
  }

  // function onDelete(button: ButtonDTO) {
  //   customFetch('button', {
  //     method: 'DELETE',
  //     body: JSON.stringify(button),
  //     headers: { 'Content-Type': 'application/json' }
  //   }, () => {
  //     avatarDataDispatch({ type: 'removeButton', button: button, avatarId: avatar.id!, layoutId: layout.id! });
  //     navigate(-1);
  //   });
  // }

  // function setButtonPicture(file: UploadedFileDTO | null) {
  //   layoutsDispatch({ type: 'changeButtonPicture', layoutId: layoutId || '', groupId: groupId || '', buttonId: button.id, image: file });
  //   button.image = file;
  //   setPreviewImage(file);
  // }

  // function setLocalButtonPicture(file?: File | null) {
  //   if (file) {
  //     setPreviewImage({ fileName: file.name, urlPath: URL.createObjectURL(file) });
  //   } else {
  //     setPreviewImage(button.image);
  //   }
  // }

  function valuePrimaryPlaceholder(): string {
    switch (formWatch.buttonType) {
      case ButtonTypeSchema.Enum.Button:
        return 'Value';
      case ButtonTypeSchema.Enum.Toggle:
        return 'Active value';
      case ButtonTypeSchema.Enum.Slider:
        return 'Minimum value';
    }
  }

  function valueSecondaryPlaceholder(): string {
    switch (formWatch.buttonType) {
      case ButtonTypeSchema.Enum.Button:
        return '';
      case ButtonTypeSchema.Enum.Toggle:
        return 'Inactive value';
      case ButtonTypeSchema.Enum.Slider:
        return 'Maximum value';
    }
  }

  return (<Segment segmentTitle={isNew ? 'New button' : 'Edit button'} width={'2'}>

    <form onSubmit={handleSubmit(onSubmit)}>
      <HiddenInput register={register} name={'groupId'} />
      <HiddenInput register={register} name={'id'} />
      <HiddenInput register={register} name={'order'} />
      <FormTable>
        <tr>
          <th style={{ width: '125px' }}>Label</th>
          <td><Input register={register} name={'label'} width={'300px'} errors={errors} /></td>
        </tr>
        <tr>
          <th>Show label</th>
          <td>
            <CheckboxInput register={register} name={'showLabel'} errors={errors} />
          </td>
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
                   readOnly={formWatch.buttonType !== ButtonTypeSchema.Enum.Slider && formWatch.buttonType !== ButtonTypeSchema.Enum.Toggle} />
          </td>
        </tr>
        <tr>
          <th>Button type</th>
          <td>
            <SelectInput options={ButtonTypeSchema.options.map(t => ({ key: t, value: t }))} register={register} name={'buttonType'} errors={errors} />
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
      </FormTable>
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
            <FormAddRow colSpan={3} items={callbackParameters.fields.length} limit={tier.callbackParameters} onClick={() => callbackParameters.append({ path: '', value: '', seconds: 0 })} />
          </tr>
          </tbody>
        </FormTableStyled>
      </fieldset>
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
                        onClick={() => visibilityParameters.append({ path: '', value: '', condition: 'Equal' })} />
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
        <IconButton role={'save'} disabled={!isDirty} />
        <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
      </FormControlBar>

    </form>
  </Segment>);
}
