import { AvatarDTO, AvatarFormSchema, ReactProps } from 'cmap2-shared';
import FormTable from '../../../../../shared/components/form/formTable.component';
import FormControlBar from '../../../../../shared/components/form/formControlBar.component';
import React, { useContext, useEffect } from 'react';
import useCmapFetch from '../../../../../shared/hooks/cmapFetch.hook';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { useNavigate } from 'react-router-dom';
import { AvatarReducerAction } from '../../avatars.reducer';
import { ModalContext } from '../../../../../components/mainWindow/mainWindow.componenet';
import HiddenInput from '../../../../../shared/components/form/inputs/hidden.component';
import CheckboxInput from '../../../../../shared/components/form/inputs/checkbox.component';
import Input from '../../../../../shared/components/form/inputs/input.component';
import IconButton from '../../../../../shared/components/buttons/iconButton.component';
import ContentBox from '../../../../../shared/components/contentBox/contentBox.component';

interface AvatarSettingsProps extends ReactProps {
    selectedAvatar: AvatarDTO;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function AvatarSettings({ selectedAvatar, avatarDataDispatch }: AvatarSettingsProps) {

    const customFetch = useCmapFetch();
    const { register, reset, formState: { errors, isDirty }, handleSubmit, setValue } = useForm({ resolver: zodResolver(AvatarFormSchema) });
    const navigate = useNavigate();

    useEffect(() => {
        reset({
            id: selectedAvatar?.id ? selectedAvatar?.id : null,
            vrcId: selectedAvatar?.vrcId,
            label: selectedAvatar?.label,
            default: selectedAvatar?.default ? selectedAvatar?.default : false,
        });
    }, [selectedAvatar]);

    function onSave(formData: any) {
        customFetch<AvatarDTO>('avatar', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        }, (data, res) => {
            if (res.code === 201) {
                avatarDataDispatch({ type: 'addAvatar', avatar: data });
                navigate('/website/avatars/' + data.id);
            } else {
                avatarDataDispatch({ type: 'editAvatar', avatar: formData });
                reset({
                    id: formData?.id ? formData?.id : null,
                    vrcId: formData?.vrcId,
                    label: formData?.label,
                    default: formData?.default ? formData?.default : false,
                });
            }
        });
    }

    function onDelete(avatar: AvatarDTO) {
        customFetch('avatar', {
            method: 'DELETE',
            body: JSON.stringify(avatar),
            headers: { 'Content-Type': 'application/json' }
        }, () => {
            avatarDataDispatch({ type: 'removeAvatar', avatar: avatar });
            navigate('/website/avatars');
        });
    }

    return (<ContentBox contentTitle={'Avatar settings'}>
        <form onSubmit={handleSubmit(onSave)}>
            <HiddenInput register={register} name={'id'} />
            <FormTable>
                <tr>
                    <th>Label</th>
                    <td><Input register={register} name={'label'} errors={errors} /></td>
                </tr>
                <tr>
                    <th>VRChat avatar ID</th>
                    <td><Input register={register} name={'vrcId'} errors={errors} /></td>
                </tr>
                <tr>
                    <th>Default avatar</th>
                    <td><CheckboxInput register={register} name={'default'} errors={errors} /></td>
                </tr>
            </FormTable>
            <FormControlBar>
                <IconButton role={'save'} disabled={!isDirty} />
                <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
                {selectedAvatar.id && <>
                    <hr />
                    <IconButton role={'delete'} deleteKeyword={'avatar'} size={'small'} onClick={() => onDelete(selectedAvatar)} />
                </>}
            </FormControlBar>
        </form>
    </ContentBox>);
}
