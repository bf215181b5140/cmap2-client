import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../../../hooks/useNotifications.hook';
import { useContext, useEffect } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import { GroupFormDTO, GroupFormSchema, GroupSchema, GroupWidthSchema, VisibilityParameterConditionSchema } from 'cmap2-shared';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Segment from '../../../../../components/segment/segment.component';
import HiddenInput from '../../../../../components/input/hidden.component';
import FormTable, { FormTableStyled } from '../../../../../components/form/formTable.component';
import Input from '../../../../../components/input/input.component';
import CheckboxInput from '../../../../../components/input/checkbox.component';
import SelectInput from '../../../../../components/input/select.component';
import ParameterInput from '../../../../../components/input/parameterInput/parameterInput.component';
import FormRemoveRow from '../../../../../components/form/removeRow/formRemoveRow.component';
import FormAddRow from '../../../../../components/form/addRow/formAddRow.component';
import FormControlBar from '../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../components/buttons/iconButton.component';

export default function GroupForm() {

  const navigate = useNavigate();
  const { POST, PUT } = useCmapFetch();
  const { addNotification } = useNotifications();
  const { tier, interactionKeys, layoutsDispatch, layoutId, layout, group } = useContext(LayoutsPageContext);

  const defaultValue: GroupFormDTO = {
    id: null,
    layoutId: layoutId || '',
    label: '',
    showLabel: false,
    order: (layout?.groups?.length ?? 0) + 1,
    width: 'Full',
    visibilityParameters: [],
    interactionKeyId: null,
    ...group,
  };

  const { register, setValue, control, formState: { errors, isDirty }, reset, handleSubmit } = useForm<GroupFormDTO>({
    resolver: zodResolver(GroupFormSchema),
    defaultValues: defaultValue,
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'visibilityParameters' });

  useEffect(() => {
    reset(defaultValue);
  }, [group]);

  const isNew = !defaultValue.id;

  function onSubmit(formData: GroupFormDTO) {
    if (isNew) {
      PUT('layouts/group', formData, GroupSchema, data => {
        layoutsDispatch({ type: 'addGroup', group: data, layoutId: formData.layoutId });
        addNotification('Success', 'New group added.');
        navigate(-1);
      });
    } else {
      POST('layouts/group', formData, GroupSchema, data => {
        layoutsDispatch({ type: 'editGroup', group: data, layoutId: formData.layoutId });
        navigate(-1);
      });
    }
  }

  return (<Segment segmentTitle={isNew ? 'Add group' : 'Edit group'}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <HiddenInput register={register} name={'layoutId'} />
      <HiddenInput register={register} name={'id'} />
      <HiddenInput register={register} name={'order'} />
      <FormTable>
        <tr>
          <th style={{ width: '110px' }}>Label</th>
          <td>
            <Input register={register} name={'label'} width={'300px'} errors={errors} />
          </td>
        </tr>
        <tr>
          <th>Show label</th>
          <td>
            <CheckboxInput register={register} name={'showLabel'} errors={errors} />
          </td>
        </tr>
        <tr>
          <th>Minimum width</th>
          <td>
            <SelectInput options={GroupWidthSchema.options.map(o => ({ key: o, value: o }))} register={register} name={'width'} errors={errors} />
          </td>
        </tr>
      </FormTable>
      <fieldset>
        <legend>Visibility parameters</legend>
        <p>You can set group visibility based on specific avatar parameter values. Group will only be visible if at least one parameter matches the condition
          specified.</p>
        <FormTableStyled>
          {fields.length > 0 && <thead>
          <tr>
            <th>Parameter</th>
            <th style={{ width: '75px' }}>Value</th>
            <th style={{ width: '120px' }}>Condition</th>
            <th></th>
          </tr>
          </thead>}
          <tbody>
          {fields.map((item, index) => (
            <tr key={index}>
              <td>
                <ParameterInput register={register} name={`visibilityParameters.${index}.path`} width={'100%'} defaultAvatarVrcId={layout?.avatars.at(0)} defaultType={'input'} setValue={setValue} errors={errors} />
              </td>
              <td>
                <Input register={register} name={`visibilityParameters.${index}.value`} errors={errors} />
              </td>
              <td>
                <SelectInput options={VisibilityParameterConditionSchema.options.map(c => ({ key: c, value: c.replace('_', ' ') }))} register={register}
                             name={`visibilityParameters.${index}.condition`} width={'100%'} errors={errors} />
              </td>
              <FormRemoveRow onClick={() => remove(index)} />
            </tr>
          ))}
          <tr>
            <FormAddRow colSpan={3} items={fields.length} limit={tier.visibilityParameters} onClick={() => append({ path: '', value: 0, condition: 'Equal' })} />
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