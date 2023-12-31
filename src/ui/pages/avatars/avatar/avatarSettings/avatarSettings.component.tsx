import FormInput from '../../../../shared/components/form/formInput.component';
import { AvatarDto, ButtonStyleDto, InputType, ReactProps, TierDto } from 'cmap2-shared';
import FormTable from '../../../../shared/components/form/formTable.component';
import FormControlBar from '../../../../shared/components/form/formControlBar.component';
import { ContentBox } from 'cmap2-shared/dist/react';
import React, { useContext, useEffect } from 'react';
import useCustomFetch from '../../../../shared/hooks/customFetch.hook';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { useNavigate } from 'react-router-dom';
import { AvatarReducerAction } from '../../avatars.reducer';
import { avatarSchema } from 'cmap2-shared/dist/zodSchemas';
import { EventBus } from '../../../../shared/util/eventBus';
import { VRChatOscAvatar } from '../../../../../shared/interfaces';
import { ModalContext } from '../../../../app/mainWindow/mainWindow.componenet';

interface AvatarSettingsProps extends ReactProps {
    selectedAvatar: AvatarDto;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
    eventBus: EventBus<VRChatOscAvatar>;
}

export default function AvatarSettings({selectedAvatar, avatarDataDispatch, eventBus}: AvatarSettingsProps) {

    const customFetch = useCustomFetch();
    const { deleteModal } = useContext(ModalContext);
    const {register, reset, formState: {errors, isDirty}, handleSubmit, setValue} = useForm({resolver: zodResolver(avatarSchema)});
    const navigate = useNavigate();

    useEffect(() => {
        eventBus.on('vrcAvatarData', fillFormFromFile);
        return () => eventBus.off('vrcAvatarData', fillFormFromFile);
    }, []);

    useEffect(() => {
        reset({
            id: selectedAvatar?.id ? selectedAvatar?.id : null,
            vrcId: selectedAvatar?.vrcId,
            label: selectedAvatar?.label,
            default: selectedAvatar?.default ? selectedAvatar?.default : false,
        });
    }, [selectedAvatar]);

    function fillFormFromFile(data: VRChatOscAvatar) {
        setValue('label', data.name);
        setValue('vrcId', data.id);
    }

    function onSave(formData: any) {
        customFetch<AvatarDto>('avatar', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.code === 200) {
                avatarDataDispatch({type: 'editAvatar', avatar: formData});
                reset({
                    id: formData?.id ? formData?.id : null,
                    vrcId: formData?.vrcId,
                    label: formData?.label,
                    default: formData?.default ? formData?.default : false,
                });
            }
            if (res?.code === 201 && res.body) {
                avatarDataDispatch({type: 'addAvatar', avatar: res.body});
                navigate('/avatars/' + res.body.id);
            }
        });
    }

    function onDelete(avatar: AvatarDto) {
        customFetch('avatar', {
            method: 'DELETE',
            body: JSON.stringify(avatar),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.code === 200) {
                avatarDataDispatch({type: 'removeAvatar', avatar: avatar});
                navigate('/avatars');
            }
        });
    }

    return (<ContentBox>
        <form onSubmit={handleSubmit(onSave)}>
            <FormInput type={InputType.Hidden} register={register} name={'id'} />
            <FormTable>
                <tr>
                    <th>Label</th>
                    <td><FormInput type={InputType.Text} register={register} name={'label'} errors={errors} /></td>
                </tr>
                <tr>
                    <th>VRChat avatar ID</th>
                    <td><FormInput type={InputType.Text} register={register} name={'vrcId'} errors={errors} /></td>
                </tr>
                <tr>
                    <th>Default avatar</th>
                    <td><FormInput type={InputType.Boolean} register={register} name={'default'} errors={errors} /></td>
                </tr>
            </FormTable>
            <FormControlBar>
                <FormInput type={InputType.Submit} disabled={!isDirty} />
                <FormInput type={InputType.Button} value="Reset" disabled={!isDirty} onClick={() => reset()} />
                <FormInput type={InputType.Button} value="Delete" onClick={() => deleteModal('avatar', () => onDelete(selectedAvatar))} />
            </FormControlBar>
        </form>
    </ContentBox>);
}
