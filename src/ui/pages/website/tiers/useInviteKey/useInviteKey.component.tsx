import Segment from '../../../../components/segment/segment.component';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import { useForm } from 'react-hook-form';
import { TierDTO, TierSchema, UseInviteKeyFormDTO, UseInviteKeyFormSchema } from 'cmap2-shared';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../components/form/formTable.component';
import Input from '../../../../components/input/input.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import React, { Dispatch, SetStateAction } from 'react';
import { useNotifications } from '../../../../hooks/useNotifications.hook';

interface UseInviteKeyProps {
  setClientTier: Dispatch<SetStateAction<TierDTO | undefined>>;
}

export default function UseInviteKey({ setClientTier }: UseInviteKeyProps) {

  const { POST } = useCmapFetch();
  const { addNotification } = useNotifications();
  const { register, reset, formState: { errors, isDirty }, handleSubmit } = useForm<UseInviteKeyFormDTO>({
    resolver: zodResolver(UseInviteKeyFormSchema),
    defaultValues: {
      key: ''
    }
  });

  const onSubmit = (formData: UseInviteKeyFormDTO) => {
    POST('tiers/useInviteKey', formData, TierSchema, data => {
      setClientTier(data);
      reset();
      addNotification('success', 'New invite key has been generated successfully.');
    }, () => reset());
  };

  return (<Segment segmentTitle={'Use invite key'} infoContent={segmentInfo}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTable>
        <tr>
          <td><Input register={register} placeholder={'Invite key'} name={'key'} errors={errors} /></td>
          <td><IconButton role={'save'} tooltip={'Apply key'} disabled={!isDirty} /></td>
        </tr>
      </FormTable>
    </form>
  </Segment>);
}

const segmentInfo = <>
  <p>If you received an invite key for a higher tier than your current account, use it here to upgrade your account.</p>
</>;