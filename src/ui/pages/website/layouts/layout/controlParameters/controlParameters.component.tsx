import Segment from '../../../../../components/segment/segment.component';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useContext, useEffect } from 'react';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { ControlParameterSchema, ControlParametersFormDTO, ControlParametersFormSchema } from 'cmap2-shared';
import { LayoutsPageContext } from '../../layouts.context';
import { z } from 'zod';
import { FormTableStyled } from '../../../../../components/form/formTable.component';
import HiddenInput from '../../../../../components/input/hidden.component';
import Input from '../../../../../components/input/input.component';
import IconButton from '../../../../../components/buttons/iconButton.component';
import FormControlBar from '../../../../../components/form/formControlBar.component';
import ParameterInput from '../../../../../components/input/parameterInput/parameterInput.component';

export default function ControlParamters() {

  const { POST, DELETE } = useCmapFetch();
  const { client: { tier }, layoutsDispatch, layout } = useContext(LayoutsPageContext);

  const { register, control, handleSubmit, watch, reset, formState: { errors, isDirty }, setValue } = useForm<ControlParametersFormDTO>({
    defaultValues: { controlParameters: layout?.controlParameters || [] }, resolver: zodResolver(ControlParametersFormSchema)
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'controlParameters' });
  const watchParameters = watch('controlParameters')!;

  useEffect(() => {
    reset({ controlParameters: layout?.controlParameters || [] });
  }, [layout]);

  function onSave(formData: ControlParametersFormDTO) {
    if (!layout) return;

    POST(`layouts/layout/${layout.id}/controlParameters`, formData, z.array(ControlParameterSchema), data => {
        layoutsDispatch({ type: 'saveControlParameters', controlParameters: data, layoutId: layout.id });
        reset(data);
      });
  }

  function onDelete(index: number) {
    const param = watchParameters[index];

    if (!param || !layout) return;

    if (param.id) {
      DELETE(`layouts/layout/${layout.id}/controlParameters/${param.id}`, undefined, undefined, () => {
        layoutsDispatch({ type: 'removeControlParameter', controlParameter: param, layoutId: layout.id });
        // todo no reset? no remove?
      });
    } else {
      remove(index);
    }
  }

  return (<Segment segmentTitle={'Control parameters'} infoContent={segmentInfo}>
    <form onSubmit={handleSubmit(onSave)}>
      <FormTableStyled>
        <thead>
        {watchParameters && watchParameters.length > 0 &&
          <tr>
            <th>Label</th>
            <th>Path</th>
            <th>Value</th>
            <th>Seconds</th>
          </tr>
        }
        </thead>
        <tbody>
        {fields.map((item, index) => (
          <tr key={index}>
            <td>
              <HiddenInput register={register} name={`controlParameters.${index}.id`} />
              <Input register={register} name={`controlParameters.${index}.label`} width="150px" errors={errors} />
            </td>
            <td>
              <ParameterInput register={register} name={`controlParameters.${index}.path`} errors={errors} setValue={setValue} />
            </td>
            <td>
              <Input register={register} name={`controlParameters.${index}.value`} width="75px" errors={errors} />
            </td>
            <td>
              <Input register={register} name={`controlParameters.${index}.seconds`} width="75px" errors={errors} />
            </td>
            <td>
              <IconButton role={'delete'} onClick={() => onDelete(index)} deleteKeyword={'control parameter'} size={'small'} />
            </td>
          </tr>
        ))}
        </tbody>
      </FormTableStyled>
      <hr />
      <FormControlBar>
        <IconButton role={'add'} size={'small'} disabled={watchParameters.length >= tier.controlParameters} onClick={() => append({
          id: '',
          label: '',
          path: '',
          value: '',
          seconds: 0
        })} />
        <hr />
        <IconButton role={'save'} disabled={!isDirty} />
        <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
      </FormControlBar>
    </form>
  </Segment>);
}

const segmentInfo = <>
  <p>Control parameters can be bound to some specific functionality on groups or buttons:</p>
    <ul>
      <li><b>Visibility paramters</b>: sdsfdfhsdfhsdfh</li>
      <li><b>Callback parameters</b>: When button is pressed on the website, in addition to itself, it will send this parameter with value after X seconds.</li>
    </ul>
</>;
