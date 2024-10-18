import Segment from '../../../../../components/segment/segment.component';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useContext } from 'react';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { ControlParameterSchema, ControlParametersFormDTO, ControlParametersFormSchema } from 'cmap2-shared';
import { LayoutsPageContext } from '../../layouts.context';
import { z } from 'zod';
import { FormTableStyled } from '../../../../../components/form/formTable.component';
import HiddenInput from '../../../../../components/input/hidden.component';
import Input from '../../../../../components/input/input.component';
import IconButton from '../../../../../components/buttons/iconButton.component';
import FormControlBar from '../../../../../components/form/formControlBar.component';

export default function ControlParamters() {

  const { POST, DELETE } = useCmapFetch();
  const { client: { tier }, layoutsDispatch, layout } = useContext(LayoutsPageContext);

  const { register, control, handleSubmit, watch, reset, formState: { errors, isDirty }, setValue } = useForm<ControlParametersFormDTO>({
    defaultValues: { controlParameters: layout?.controlParameters || [] }, resolver: zodResolver(ControlParametersFormSchema)
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'controlParameters' });
  const watchParameters = watch('controlParameters')!;

  // todo reset on avatar url change?
  // useEffect(() => {
  //   reset({ avatarId: selectedAvatar.id, controlParameters: [...selectedAvatar.controlParameters || []] });
  // }, [selectedAvatar, selectedAvatar.controlParameters]);

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
  <p>Control parameters are some extra specific functions I wanted for my avatar. <b>You probably wont have use for these.</b></p>
  <p>Roles:
    <ul>
      <li><b>HP</b>: parameter used to display minecraft HP bar on the website. All parameter/HP logic has to be on the avatar.
        <br />Values are minimum and maximum HP values as Int
      </li>
      <li><b>Use cost</b>: parameter used to display minecraft EXP bar on the website. When button have use cost set, it will check if this parameter
        number is high enough so it doesn't go below minimum before allowing buttons to be used.
        <br />Values are minimum and maximum EXP as Int.
      </li>
      <li><b>Callback</b>: can be selected as "Control parameter" when editing a button. When button is pressed on the website, in addition to itself, it will
        send this parameter with value after X seconds.
        <br />Useful for reseting parameters - someone turns off your pants on website and it automatically turns them on again after 15 seconds.
        <br />Values are parameter value to be sent and number of seconds after button press.
      </li>
    </ul>
  </p>
</>;
