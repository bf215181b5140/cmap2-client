import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { InteractionKeyDTO, InteractionKeySchema, InteractionKeysFormDTO, InteractionKeysFormSchema, ProfilePageDTO } from 'cmap2-shared';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import Segment from '../../../../components/segment/segment.component';
import HiddenInput from '../../../../components/input/hidden.component';
import { FormTableStyled } from '../../../../components/form/formTable.component';
import Input from '../../../../components/input/input.component';
import FormControlBar from '../../../../components/form/formControlBar.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import FormRemoveRow from '../../../../components/form/removeRow/formRemoveRow.component';
import FormAddRow from '../../../../components/form/addRow/formAddRow.component';

interface InteractionKeysProps {
  profile: ProfilePageDTO;
  setInteractionKeys: (interactionKeys: InteractionKeyDTO[]) => void;
}

export default function InteractionKeysForm({ profile, setInteractionKeys }: InteractionKeysProps) {

  const { POST } = useCmapFetch();
  const { register, control, setValue, handleSubmit, watch, reset, formState: { errors, isDirty } } = useForm<InteractionKeysFormDTO>({
    resolver: zodResolver(InteractionKeysFormSchema),
    defaultValues: {
      interactionKeys: profile.interactionKeys
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'interactionKeys' });

  const newKey = {
    id: null,
    label: '',
    key: '',
  };

  function onSubmit(formData: InteractionKeysFormDTO) {
    POST('profile/interactionKeys', formData, z.array(InteractionKeySchema), (data) => {
      setInteractionKeys(data);
      reset({ interactionKeys: data });
    });
  }

  return (<Segment segmentTitle={'Interaction keys'} infoContent={segmentInfo} width={'Full'}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTableStyled>
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
          <FormAddRow colSpan={3} items={fields.length} limit={profile.tier.interactionKeys} onClick={() => append(newKey)} />
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

const segmentInfo = <>
  <p>
    Interaction keys allow you to restrict access of website features to those who have a key.
    <br />
    Your profile visitors can enter keys by opening the keys section on your profile menu.
  </p>
</>;
