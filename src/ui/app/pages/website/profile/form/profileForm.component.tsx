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
import IconButton from '../../../../shared/components/buttons/iconButton.component';

interface ProfileFormProps {
    client: ClientDTO;
    setClientInfo: (client: ClientDTO) => void;
}

export default function ProfileForm({ client, setClientInfo }: ProfileFormProps) {

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
            setClientInfo(data);
            reset({
                displayName: data.displayName,
                bio: data.bio,
                hidden: data.hidden
            });
        });
    };

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <FormTable>
            <tr>
                <th>Display name</th>
                <td colSpan={2}><Input register={register} name={'displayName'} errors={errors} /></td>
            </tr>
            <tr>
                <th>
                    <InfoTooltipIcon title={'Displayed on the website in your profile'}>
                        Bio/message
                    </InfoTooltipIcon>
                </th>
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
        <FormControlBar>
            <IconButton type={'save'} disabled={!isDirty} />
            <IconButton type={'reset'} disabled={!isDirty} onClick={() => reset()} />
        </FormControlBar>
    </form>);
}

