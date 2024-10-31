import { GroupDTO, GroupFormDTO, GroupFormSchema, GroupSchema, GroupWidthSchema } from 'cmap2-shared';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../../../hooks/useNotifications.hook';
import { LayoutsPageContext } from '../../layouts.context';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import Segment from '../../../../../components/segment/segment.component';
import HiddenInput from '../../../../../components/input/hidden.component';
import FormTable, { FormTableStyled } from '../../../../../components/form/formTable.component';
import Input from '../../../../../components/input/input.component';
import SelectInput from '../../../../../components/input/select.component';
import FormControlBar from '../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../components/buttons/iconButton.component';
import ParameterInput from '../../../../../components/input/parameterInput/parameterInput.component';
import { VisibilityParameterConditionSchema } from 'cmap2-shared/src/enums/visibilityParameterCondition';
import AddCounter from '../../../../../components/addCounter/addCounter.component';

interface GroupFormProps {
  group: GroupDTO | undefined;
}

export default function GroupForm({ group }: GroupFormProps) {

  const navigate = useNavigate();
  const { POST, PUT, DELETE } = useCmapFetch();
  const { addNotification } = useNotifications();
  const { tier, interactionKeys, layoutsDispatch, layoutId, layout } = useContext(LayoutsPageContext);

  const defaultValue: GroupFormDTO = {
    id: null,
    layoutId: layoutId || '',
    label: '',
    order: (layout?.groups?.length ?? 0) + 1,
    width: 'Full',
    visibilityParameters: [],
    interactionKeyId: null,
    ...group,
  };

  console.log('group default value:', defaultValue);

  const { register, setValue, control, formState: { errors, isDirty }, reset, handleSubmit } = useForm<GroupFormDTO>({
    resolver: zodResolver(GroupFormSchema),
    defaultValues: defaultValue,
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'visibilityParameters' });

  console.log('group form errors', errors);

  useEffect(() => {
    reset(defaultValue);
  }, [group]);

  const canAddVisibilityParameters = fields.length < tier.visibilityParameters;
  const isNew = !defaultValue.id;

  function onSubmit(formData: GroupFormDTO) {
    if (isNew) {
      PUT('layouts/group', formData, GroupSchema, data => {
        layoutsDispatch({ type: 'addGroup', group: data, layoutId: formData.layoutId });
        addNotification('success', 'New group added.');
        reset(data);
        navigate(`/website/layouts/${layoutId}/${data.id}`);
      });
    } else {
      POST('layouts/group', formData, GroupSchema, data => {
        layoutsDispatch({ type: 'editGroup', group: data, layoutId: formData.layoutId });
        reset(data);
      });
    }
  }

  function onDelete(group: GroupDTO) {
    DELETE('layout', { id: group.id }, undefined, () => {
      layoutsDispatch({ type: 'removeGroup', layoutId: layoutId || '', groupId: group.id });
      addNotification('success', 'Group deleted.');
      navigate(`/website/layouts/${layoutId}`);
    });
  }

  return (<Segment segmentTitle={isNew ? 'Add group' : 'Edit group'}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <HiddenInput register={register} name={'layoutId'} />
      <HiddenInput register={register} name={'id'} />
      <HiddenInput register={register} name={'order'} />
      <FormTable>
        <tr>
          <th>Label</th>
          <td>
            <Input register={register} name={'label'} errors={errors} width={'350px'} />
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
            <th style={{width: '80px' }}>Value</th>
            <th style={{width: '80px' }}>Condition</th>
          </tr>
          </thead>}
          <tbody>
          {fields.map((item, index) => (
            <tr key={index}>
              <td>
                <ParameterInput register={register} name={`visibilityParameters.${index}.path`} width={'260px'} defaultType={'input'} setValue={setValue} errors={errors} />
              </td>
              <td>
                <Input register={register} name={`visibilityParameters.${index}.value`} width={'100%'} errors={errors} />
              </td>
              <td>
                <SelectInput options={VisibilityParameterConditionSchema.options.map(c => ({ key: c, value: c.replace('_', ' ') }))} register={register}
                             name={`visibilityParameters.${index}.condition`} width={'115px'} errors={errors} />
              </td>
              <td>
                <IconButton role={'remove'} size={'small'} onClick={() => remove(index)} />
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4}>
              <FormControlBar>
                <AddCounter canAddMore={canAddVisibilityParameters}>{fields.length}/{tier.visibilityParameters}</AddCounter>
                <IconButton role={'add'} size={'small'} disabled={!canAddVisibilityParameters} onClick={() => append({ path: '', value: '', condition: 'equal' })} />
              </FormControlBar>
            </td>
          </tr>
          </tbody>
        </FormTableStyled>
      </fieldset>
      <FormTable>
        <tr>
          <th>Interaction key</th>
          <td>
            <SelectInput options={[{ key: '', value: '' }, ...interactionKeys.map(k => ({ key: k.id, value: k.label }))]} register={register} name={'interactionKeyId'} errors={errors} />
          </td>
        </tr>
      </FormTable>
      <FormControlBar>
        <IconButton role={'save'} disabled={!isDirty} />
        <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
        {/* {layout.id && */}
        {/*   <> */}
        {/*     <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} /> */}
        {/*     <hr /> */}
        {/*     <IconButton role={'delete'} deleteKeyword={'layout'} size={'small'} onClick={() => onDelete(layout)} /> */}
        {/*     /!* <ButtonInput text="Cancel" onClick={() => { *!/ */}
        {/*     /!*     reset(); *!/ */}
        {/*     /!*     setEditing(false); *!/ */}
        {/*     /!* }} /> *!/ */}
        {/*   </> */}
        {/* } */}
      </FormControlBar>
    </form>
  </Segment>);
}