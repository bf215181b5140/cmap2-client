import React, { useContext } from 'react';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { InteractionKeySchema, InteractionKeysFormDTO, InteractionKeysFormSchema } from 'cmap-shared';
import { LayoutsPageContext } from '../../layouts.context';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Segment from '../../../../../components/segment/segment.component';
import { FormTableStyled } from '../../../../../components/form/formTable.component';
import HiddenInput from '../../../../../components/input/hidden.component';
import Input from '../../../../../components/input/input.component';
import IconButton from '../../../../../components/buttons/iconButton.component';
import { nanoid } from 'nanoid';
import FormRemoveRow from '../../../../../components/form/removeRow/formRemoveRow.component';
import FormAddRow from '../../../../../components/form/addRow/formAddRow.component';
import FormControlRow from '../../../../../components/form/formControlRow.component';

export default function InteractionKeys() {

  const { POST } = useCmapFetch();
  const { tier, interactionKeys, setInteractionKeys } = useContext(LayoutsPageContext);
  const { register, control, setValue, handleSubmit, reset, formState: { errors, isDirty } } = useForm<InteractionKeysFormDTO>({
    resolver: zodResolver(InteractionKeysFormSchema),
    defaultValues: {
      interactionKeys: interactionKeys
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'interactionKeys' });

  const newKey = {
    id: null,
    label: '',
    key: '',
  };

  function onSubmit(formData: InteractionKeysFormDTO) {
    POST('interactionKeys', formData, z.array(InteractionKeySchema), (data) => {
      setInteractionKeys(data);
      reset({ interactionKeys: data });
    });
  }

  return (<Segment segmentTitle={'Interaction keys'} infoContent={segmentInfo} width={'Full'}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTableStyled visible={true}>
        <thead>
        {fields.length > 0 &&
          <tr>
            <th>Label</th>
            <th>Key</th>
            <td></td>
            <td></td>
          </tr>
        }
        </thead>
        <tbody>
        {fields.map((item, index) => (
          <tr key={index}>
            <td>
              <HiddenInput register={register} name={`interactionKeys.${index}.id`} />
              <Input register={register} name={`interactionKeys.${index}.label`} errors={errors} />
            </td>
            <td>
              <Input register={register} name={`interactionKeys.${index}.key`} errors={errors} />
            </td>
            <td style={{ width: '30px' }}>
              <IconButton role={'normal'} icon={'ri-key-2-fill'} tooltip={'Generate random key'} onClick={() => setValue(`interactionKeys.${index}.key`, nanoid(16), { shouldDirty: true })} />
            </td>
            <FormRemoveRow onClick={() => remove(index)} />
          </tr>
        ))}
        <tr>
          <FormAddRow colSpan={3} items={fields.length} limit={tier.interactionKeys} onClick={() => append(newKey)} />
        </tr>
        <FormControlRow colSpan={4}>
          <IconButton role={'save'} disabled={!isDirty} />
          <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
        </FormControlRow>
        </tbody>
      </FormTableStyled>
    </form>
  </Segment>);
}

const segmentInfo = <>
  <p>
    Interaction keys allow you to restrict access of website features to those who have a key.
    <br />
    Your profile visitors can enter keys by opening the keys section on your profile menu.
  </p>
</>;
