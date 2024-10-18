import Segment from '../../../../../components/segment/segment.component';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { useFieldArray, useForm } from 'react-hook-form';
import { LayoutDTO, LayoutFormDTO, LayoutFormSchema, LayoutSchema } from 'cmap2-shared';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../../components/form/formTable.component';
import Input from '../../../../../components/input/input.component';
import FormControlBar from '../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../components/buttons/iconButton.component';
import React, { useContext, useEffect } from 'react';
import CheckboxInput from '../../../../../components/input/checkbox.component';
import NumberInput from '../../../../../components/input/number.component';
import AddCounter from '../../../../../components/addCounter/addCounter.component';
import { LayoutsPageContext } from '../../layouts.context';
import { useNavigate } from 'react-router-dom';
import ParameterInput from '../../../../../components/input/parameterInput/parameterInput.component';

interface LayoutFormProps {
  editLayout: LayoutDTO;
}

export default function LayoutForm({ editLayout }: LayoutFormProps) {

  const { POST, PUT } = useCmapFetch();
  const navigate = useNavigate();
  const { client: { tier }, layoutsDispatch } = useContext(LayoutsPageContext);
  const { register, setValue, control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<LayoutFormDTO>({
    resolver: zodResolver(LayoutFormSchema),
    defaultValues: editLayout,
  });
  // @ts-ignore
  const { fields, append, remove } = useFieldArray({ control, name: 'avatars' });

  useEffect(() => {
    reset(editLayout);
  }, [editLayout]);

  const canAddAvatars = fields.length < tier.avatars;
  const isNew = !editLayout.id;

  function onSubmit(formData: LayoutFormDTO) {
    if (isNew) {
      PUT(`layouts/layout`, formData, LayoutSchema, data => {
        layoutsDispatch({ type: 'addLayout', layout: data });
        navigate(`layouts/layout/${data.id}`);
      });
    } else {
      POST(`layouts/layout/${editLayout.id}`, formData, undefined, () => {
        layoutsDispatch({ type: 'editLayout', layout: { id: editLayout.id, ...formData } });
        reset(formData);
      });
    }
  }

  return (<Segment segmentTitle={isNew ? 'Add layout' : 'Edit layout'}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTable>
        <tr>
          <th>Label</th>
          <td><Input register={register} name={'label'} errors={errors} width={'350px'} /></td>
        </tr>
      </FormTable>
      <fieldset>
        <legend>Avatars</legend>
        <p>All the avatars that should display this layout when you use it. Avoid entering the same avatar on multiple layouts.</p>
        <FormTable>
          {fields.map((item, index) => (<tr key={index}>
            {index === 0 && <th rowSpan={fields.length}>Avatar ID</th>}
            <td>
              <Input register={register} name={`avatars.${index}`} errors={errors} width={'350px'} />
            </td>
            <td>
              <IconButton role={'delete'} size={'small'} deleteKeyword={'avatar id'} onClick={() => remove(index)} />
            </td>
          </tr>))}
          <tr>
            <td colSpan={3}>
              <FormControlBar>
                <AddCounter canAddMore={canAddAvatars}>{fields.length}/{tier.avatars}</AddCounter>
                <IconButton role={'add'} size={'small'} disabled={!canAddAvatars} onClick={() => append('')} />
              </FormControlBar>
            </td>
          </tr>
        </FormTable>
      </fieldset>
      <fieldset disabled={!tier.health}>
        <legend>Health system</legend>
        <p>When using an avatar that isn't set on any layout you can display a specific default layout.</p>
        <FormTable>
          <tr>
            <th>Enabled</th>
            <td><CheckboxInput register={register} name={'healthEnabled'} readOnly={!tier.health} errors={errors} /></td>
          </tr>
          <tr>
            <th>Parameter</th>
            <td><ParameterInput register={register} name={'healthPath'} setValue={setValue} defaultType={'output'} width={'350px'} errors={errors}/></td>
          </tr>
          <tr>
            <th>Max health</th>
            <td><NumberInput register={register} name={'healthMax'} width={'100px'} errors={errors} /></td>
          </tr>
        </FormTable>
      </fieldset>
      <fieldset disabled={!tier.useCost}>
        <legend>Use cost system</legend>
        <p>When using an avatar that isn't set on any layout you can display a specific default layout.</p>
        <FormTable>
          <tr>
            <th>Enabled</th>
            <td><CheckboxInput register={register} name={'useCostEnabled'} readOnly={!tier.useCost} errors={errors} /></td>
          </tr>
          <tr>
            <th>Parameter</th>
            <td><ParameterInput register={register} name={'useCostPath'} setValue={setValue} defaultType={'output'} width={'350px'} errors={errors} /></td>
          </tr>
          <tr>
            <th>Max cost?</th>
            <td><NumberInput register={register} name={'useCostMax'} width={'100px'} errors={errors} /></td>
          </tr>
        </FormTable>
      </fieldset>
      <FormControlBar>
        <IconButton role={'save'} disabled={!isDirty} />
        <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
      </FormControlBar>
    </form>
  </Segment>)
    ;
}