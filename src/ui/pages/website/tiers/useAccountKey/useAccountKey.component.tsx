import Segment from '../../../../components/segment/segment.component';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import { useForm } from 'react-hook-form';
import { TierDTO, TierSchema, UseAccountKeyFormDTO, UseAccountKeyFormSchema } from 'cmap2-shared';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../components/form/formTable.component';
import Input from '../../../../components/input/input.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import React, { Dispatch, SetStateAction } from 'react';
import { useNotifications } from '../../../../hooks/useNotifications.hook';

interface UseAccountKeyProps {
    setClientTier: Dispatch<SetStateAction<TierDTO | undefined>>;
}

export default function UseAccountKey({ setClientTier }: UseAccountKeyProps) {

    const { POST } = useCmapFetch();
    const { addNotification } = useNotifications();
    const { register, reset, formState: { errors, isDirty }, handleSubmit } = useForm<UseAccountKeyFormDTO>({
        resolver: zodResolver(UseAccountKeyFormSchema),
        defaultValues: {
            key: ''
        }
    });

    const onSubmit = (formData: UseAccountKeyFormDTO) => {
        POST('tiers/useAccountKey', formData, TierSchema, data => {
            setClientTier(data);
            reset();
            addNotification('success', 'New account key has been generated successfully.');
        }, () => reset());
    };

    return(<Segment segmentTitle={'Use account key'}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormTable>
                <tr>
                    <td><Input register={register} placeholder={'Account key'} name={'key'} errors={errors} /></td>
                    <td><IconButton role={'save'} tooltip={'Apply key'} disabled={!isDirty} /></td>
                </tr>
            </FormTable>
        </form>
    </Segment>)
}