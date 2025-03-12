import { LayoutDTO, LayoutFormDTO, LayoutFormSchema, LayoutSchema } from 'cmap2-shared';
import { useNavigate } from 'react-router-dom';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../../hooks/useNotifications.hook';
import { useContext, useEffect } from 'react';
import { LayoutsPageContext } from '../../../layouts.context';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Segment from '../../../../../../components/segment/segment.component';
import HiddenInput from '../../../../../../components/input/hidden.component';
import FormTable, { FormTableStyled } from '../../../../../../components/form/formTable.component';
import Input from '../../../../../../components/input/input.component';
import AvatarInput from '../../../../../../components/input/avatarInput/avatarInput.component';
import FormRemoveRow from '../../../../../../components/form/removeRow/formRemoveRow.component';
import FormAddRow from '../../../../../../components/form/addRow/formAddRow.component';
import CheckboxInput from '../../../../../../components/input/checkbox.component';
import ParameterInput from '../../../../../../components/input/parameterInput/parameterInput.component';
import NumberInput from '../../../../../../components/input/number.component';
import IconButton from '../../../../../../components/buttons/iconButton.component';
import FormControlRow from '../../../../../../components/form/formControlRow.component';
import FormControlBar from '../../../../../../components/form/formControlBar.component';
import { ModalContext } from '../../../../../../components/context/modal.context';
import BasicModal from '../../../../../../components/modal/basicModal/basicModal.component';

interface LayoutFormProps {
  layout: LayoutDTO | undefined;
}

export default function LayoutForm({ layout }: LayoutFormProps) {

  const defaultValue: LayoutFormDTO = layout || {
    id: null,
    label: '',
    avatars: [],
    healthEnabled: false,
    healthMax: null,
    healthPath: null,
    useCostEnabled: false,
    useCostMax: null,
    useCostPath: null
  };

  const navigate = useNavigate();
  const { POST, PUT, DELETE } = useCmapFetch();
  const { setModal } = useContext(ModalContext);
  const { addNotification } = useNotifications();
  const { tier, layoutsDispatch } = useContext(LayoutsPageContext);
  const { register, setValue, control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<LayoutFormDTO>({
    resolver: zodResolver(LayoutFormSchema),
    defaultValues: defaultValue,
  });
  // @ts-ignore
  const { fields, append, remove } = useFieldArray({ control, name: 'avatars' });

  useEffect(() => {
    reset(defaultValue);
  }, [layout]);

  const isNew = !defaultValue.id;

  function onSubmit(formData: LayoutFormDTO) {
    if (isNew) {
      PUT('layouts/layout', formData, LayoutSchema, data => {
        layoutsDispatch({ type: 'addLayout', layout: data });
        addNotification('Success', 'New layout added.');
        navigate(`/website/layouts/${data.id}`);
      });
    } else {
      POST('layouts/layout', formData, LayoutSchema, data => {
        layoutsDispatch({ type: 'editLayout', layout: data });
        addNotification('Success', 'Layout saved.');
        navigate(`/website/layouts/${data.id}`);
      });
    }
  }

  function onCopy() {
    if (!layout?.id) return;
    setModal(<BasicModal title={`Copying layout ${layout?.label}`} message={'You are about to make a copy of this layout.'} confirmFunction={() => {
      POST('layouts/layout/copy', { id: layout.id }, LayoutSchema, data => {
        layoutsDispatch({ type: 'addLayout', layout: data });
      });
    }} />);
  }

  function onDelete() {
    if (!layout?.id) return;
    DELETE('layouts/layout', { id: layout.id }, undefined, () => {
      layoutsDispatch({ type: 'removeLayout', layout });
    });
  }

  return (<Segment segmentTitle={isNew ? 'Add layout' : 'Edit layout'}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <HiddenInput register={register} name={'id'} />
      <FormTable visible={true}>
        <tr>
          <th style={{ width: '45px' }}>Label</th>
          <td><Input register={register} name={'label'} width={'300px'} errors={errors} /></td>
        </tr>
        <tr>
          <td colSpan={2}>
            <fieldset>
              <legend>Avatars</legend>
              <p>Avatars that will display this layout when you use them. Don't have the same avatar on multiple layouts.</p>
              <FormTableStyled>
                {fields.length > 0 && <thead>
                <tr>
                  <th>Avatar</th>
                  <th></th>
                </tr>
                </thead>}
                <tbody>
                {fields.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <AvatarInput register={register} name={`avatars.${index}`} setValue={setValue} errors={errors} />
                    </td>
                    <FormRemoveRow onClick={() => remove(index)} />
                  </tr>
                ))}
                <tr>
                  <FormAddRow colSpan={1} items={fields.length} limit={tier.layoutAvatars} onClick={() => append('')} />
                </tr>
                </tbody>
              </FormTableStyled>
            </fieldset>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <fieldset disabled={!tier.health}>
              <legend>Health system</legend>
              <p>A very niche functionality that will display Minecraft style health on your profile. Actual health system has to be on your VRChat avatar.</p>
              <FormTable>
                <tr>
                  <th style={{ width: '80px' }}>Enabled</th>
                  <td><CheckboxInput register={register} name={'healthEnabled'} readOnly={!tier.health} errors={errors} /></td>
                </tr>
                <tr>
                  <th>Parameter</th>
                  <td><ParameterInput register={register} name={'healthPath'} setValue={setValue} defaultType={'output'} defaultAvatarVrcId={layout?.avatars.at(0)} errors={errors} /></td>
                </tr>
                <tr>
                  <th>Max health</th>
                  <td><NumberInput register={register} name={'healthMax'} width={'100px'} errors={errors} /></td>
                </tr>
              </FormTable>
            </fieldset>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <fieldset disabled={!tier.useCost}>
              <legend>Use cost/experience system</legend>
              <p>A very niche functionality that enables buttons to have a cost. It displays Minecraft style experience bar on your profile. Actual cost/experience system has to be on your VRChat
                avatar.</p>
              <FormTable>
                <tr>
                  <th style={{ width: '80px' }}>Enabled</th>
                  <td><CheckboxInput register={register} name={'useCostEnabled'} readOnly={!tier.useCost} errors={errors} /></td>
                </tr>
                <tr>
                  <th>Parameter</th>
                  <td><ParameterInput register={register} name={'useCostPath'} setValue={setValue} defaultType={'output'} defaultAvatarVrcId={layout?.avatars.at(0)} errors={errors} /></td>
                </tr>
                <tr>
                  <th>Max cost</th>
                  <td><NumberInput register={register} name={'useCostMax'} width={'100px'} errors={errors} /></td>
                </tr>
              </FormTable>
            </fieldset>
          </td>
        </tr>
        <FormControlRow colSpan={2}>
          <IconButton role={'save'} disabled={!isDirty} />
          <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
        </FormControlRow>
      </FormTable>
    </form>
    <FormControlBar>
      <IconButton role={'normal'} size={'small'} tooltip={'Create a copy'} icon={'ri-file-copy-line'} disabled={!layout?.id} onClick={onCopy} />
      <hr />
      <IconButton role={'delete'} size={'small'} tooltip={'Delete layout'} deleteKeyword={'layout'} disabled={!layout?.id} onClick={onDelete} />
    </FormControlBar>
  </Segment>);
}