import useCmapFetch from '../../../hooks/cmapFetch.hook';
import { Dispatch, SetStateAction } from 'react';
import { TierDTO, TierSchema, UseInviteKeyFormDTO, UseInviteKeyFormSchema } from 'cmap2-shared';
import { useNotifications } from '../../../hooks/useNotifications.hook';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Segment from '../../../components/segment/segment.component';
import FormTable from '../../../components/form/formTable.component';
import Input from '../../../components/input/input.component';
import IconButton from '../../../components/buttons/iconButton.component';

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
      addNotification('Success', 'New invite key has been generated successfully.');
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