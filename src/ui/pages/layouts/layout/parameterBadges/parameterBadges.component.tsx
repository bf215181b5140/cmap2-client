import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import { useContext, useEffect } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import { ParameterBadgeFormDTO, ParameterBadgeFormSchema, ParameterBadgeSchema, ParameterBadgeTypeSchema } from 'cmap2-shared';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Segment from '../../../../components/segment/segment.component';
import ParameterBadgePreview from './preview/parameterBadgePreview.component';
import HiddenInput from '../../../../components/input/hidden.component';
import { FormTableStyled } from '../../../../components/form/formTable.component';
import SelectInput from '../../../../components/input/select.component';
import ParameterInput from '../../../../components/input/parameterInput/parameterInput.component';
import Input from '../../../../components/input/input.component';
import NumberInput from '../../../../components/input/number.component';
import FormRemoveRow from '../../../../components/form/removeRow/formRemoveRow.component';
import FormAddRow from '../../../../components/form/addRow/formAddRow.component';
import FormControlBar from '../../../../components/form/formControlBar.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import styled from 'styled-components';
import ExternalLink from '../../../../components/externalLink/externalLink.component';
import copyIconClassExample from '../../../../images/stateBadges-copyIconClassExample.png';

export default function ParameterBadges() {

  const { POST } = useCmapFetch();
  const { tier, layoutsDispatch, layoutId, layout } = useContext(LayoutsPageContext);

  const defaultValue: ParameterBadgeFormDTO = {
    layoutId: layoutId || '',
    parameterBadges: layout?.parameterBadges && [...layout?.parameterBadges] || [],
  };

  const { register, control, watch, handleSubmit, reset, formState: { errors, isDirty }, setValue } = useForm<ParameterBadgeFormDTO>({
    resolver: zodResolver(ParameterBadgeFormSchema),
    defaultValues: defaultValue,
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'parameterBadges' });
  const parameterBadges = watch('parameterBadges'); // fields doesn't properly update object properties

  const newBadge = {
    id: null,
    type: ParameterBadgeTypeSchema.Enum.Custom,
    path: '',
    value: '',
    label: '',
    icon: '',
    order: fields.reduce((max, b) => Math.max(max, b.order) + 1, 0)
  };

  useEffect(() => {
    reset(defaultValue);
  }, [layout]);

  function onSubmit(formData: ParameterBadgeFormDTO) {
    POST('layouts/layout/parameterBadges', formData, z.array(ParameterBadgeSchema), data => {
      layoutsDispatch({ type: 'saveParameterBadges', layoutId: formData.layoutId, parameterBadges: data });
      reset({
        layoutId: formData.layoutId,
        parameterBadges: data,
      });
    });
  }

  function onTypeChange(value: string, index: number) {
    let pathValue;
    switch (value) {
      case ParameterBadgeTypeSchema.Enum.Mute:
        pathValue = '/avatar/parameters/Mute';
        break;
      case ParameterBadgeTypeSchema.Enum.VrMode:
        pathValue = '/avatar/parameters/VrMode';
        break;
      case ParameterBadgeTypeSchema.Enum.TrackingType:
        pathValue = '/avatar/parameters/TrackingType';
        break;
      case ParameterBadgeTypeSchema.Enum.Afk:
        pathValue = '/avatar/parameters/Afk';
        break;
      default:
        pathValue = '';
        break;
    }
    setValue(`parameterBadges.${index}.path`, pathValue);
    setValue(`parameterBadges.${index}.value`, '');
    setValue(`parameterBadges.${index}.label`, '');
    setValue(`parameterBadges.${index}.icon`, '');
  }

  return (<Segment segmentTitle={'Parameter badges'} infoContent={segmentInfo}>

    {parameterBadges.length > 0 && <>
      <h3>Preview</h3>
      <BadgeBox>
        {parameterBadges?.map(badge => (<ParameterBadgePreview badge={badge} key={Math.random().toString()} />))}
      </BadgeBox>
    </>}

    <form onSubmit={handleSubmit(onSubmit)}>
      <HiddenInput register={register} name={'layoutId'} />
      <FormTableStyled>
        <thead>
        {parameterBadges.length > 0 &&
          <tr>
            <th style={{ width: '130px' }}>Badge type</th>
            <th>Parameter</th>
            <th style={{ width: '75px' }}>Value</th>
            <th>Label</th>
            <th>Icon</th>
            <th style={{ width: '60px' }}>Order</th>
            <td></td>
          </tr>
        }
        </thead>
        <tbody>
        {parameterBadges.map((item, index) => (
          <tr key={index}>
            <td>
              <HiddenInput register={register} name={`parameterBadges.${index}.id`} />
              <SelectInput options={ParameterBadgeTypeSchema.options.map(t => ({ key: t, value: t }))} onChange={event => onTypeChange(event.target.value, index)} register={register}
                           name={`parameterBadges.${index}.type`} errors={errors} />
            </td>
            <td>
              <ParameterInput register={register} name={`parameterBadges.${index}.path`} errors={errors} setValue={setValue} defaultType={'output'} />
            </td>
            <td>
              <Input register={register} name={`parameterBadges.${index}.value`} readOnly={parameterBadges[index].type !== ParameterBadgeTypeSchema.Enum.Custom} errors={errors} />
            </td>
            <td>
              <Input register={register} name={`parameterBadges.${index}.label`} readOnly={parameterBadges[index].type !== ParameterBadgeTypeSchema.Enum.Custom} errors={errors} />
            </td>
            <td>
              <Input register={register} name={`parameterBadges.${index}.icon`} readOnly={parameterBadges[index].type !== ParameterBadgeTypeSchema.Enum.Custom} errors={errors} />
            </td>
            <td>
              <NumberInput register={register} name={`parameterBadges.${index}.order`} errors={errors} />
            </td>
            <FormRemoveRow onClick={() => remove(index)} />
          </tr>
        ))}
        <tr>
          <FormAddRow colSpan={6} items={fields.length} limit={tier.parameterBadges} onClick={() => append(newBadge)} />
        </tr>
        </tbody>
      </FormTableStyled>
      <FormControlBar>
        <IconButton role={'save'} disabled={!isDirty} />
        <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
      </FormControlBar>
    </form>
  </Segment>);
}

const BadgeBox = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  background-color: ${props => props.theme.colors.ui.background4};
  border-radius: 8px;
  margin: 0 0 16px 0;
  padding: 2px 0;
  min-height: 24px;
`;

const segmentInfo = <>
  <p>Parameter badges are displayed under your username on your website profile. They are used to show various states such as if you're muted, afk, tracking type or anything else you set up with a
    Custom badge.</p>
  <p>Custom badges can be displayed in two different ways:</p>
  <ul>
    <li>If <b>Label</b> field includes the phrase <b>{'{v}'}</b> then badge will always be shown and it will display parameter value instead of <b>{'{v}'}</b> - the most common use case would be to
      display a counter, ex: <b>Headpats: {'{v}'}</b> would show up as <b>Headpats: 14</b></li>
    <li>Otherwise badge will only be visible when parameter value on avatar matches exactly what is specified in <b>Value</b> field</li>
  </ul>
  <p>For icons, you can pick any from <ExternalLink link={'https://remixicon.com/'}>https://remixicon.com/</ExternalLink> and just copy their class value.
    <br />
    <b>Example:</b> if you wanted the first icon listed, <b><i className={'ri-arrow-left-up-line'} />arrow-left-up</b>, you would click on it and
    copy <b>ri-arrow-left-up-line</b></p>
  <img alt={'Copy icon class example'} src={copyIconClassExample} style={{ textAlign: 'center', margin: '5px auto', maxWidth: '640px' }} />
</>;
