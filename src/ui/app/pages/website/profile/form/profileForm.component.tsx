import { ClientDTO, ProfileFormSchema } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import React, { Dispatch, SetStateAction } from 'react';
import FormTable from '../../../../shared/components/form/formTable.component';
import Input from '../../../../shared/components/form/inputs/input.component';
import TextareaInput from '../../../../shared/components/form/inputs/textarea.component';
import CheckboxInput from '../../../../shared/components/form/inputs/checkbox.component';
import FormControlBar from '../../../../shared/components/form/formControlBar.component';
import SubmitInput from '../../../../shared/components/form/inputs/submit.component';
import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import InfoTooltipIcon from '../../../../shared/components/infoTooltipIcon.component';

interface ProfileFormProps {
    client: ClientDTO;
    setClient: Dispatch<SetStateAction<ClientDTO | null>>;
}

export default function ProfileForm({ client, setClient }: ProfileFormProps) {

    const customFetch = useCmapFetch();
    const { register, reset, formState: { errors, isDirty }, handleSubmit } = useForm({
        defaultValues: client,
        resolver: zodResolver(ProfileFormSchema)
    });

    const onSubmit = (formData: any) => {
        customFetch<ClientDTO>('profile', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        }, data => {
            setClient(data);
            reset({
                displayName: data.displayName,
                bio: data.bio,
                hidden: data.hidden
            });
        });
    };

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <h2>Edit profile</h2>
        <FormTable>
            <tr>
                <th>Display name</th>
                <td colSpan={2}><Input register={register} name={'displayName'} errors={errors} /></td>
            </tr>
            <tr>
                <th>Bio</th>
                <td colSpan={2}><TextareaInput register={register} name={'bio'} errors={errors} width={'400px'} /></td>
            </tr>
            <tr>
                <th>
                    <InfoTooltipIcon title={'Your profile won\'t show up on website main page, but it\'s still accessible with direct links'}>
                        Hide profile
                    </InfoTooltipIcon>
                </th>
                <td><CheckboxInput register={register} name={'hidden'} errors={errors} /></td>
            </tr>
        </FormTable>
        <FormControlBar><SubmitInput disabled={!isDirty} /></FormControlBar>
    </form>);
}

