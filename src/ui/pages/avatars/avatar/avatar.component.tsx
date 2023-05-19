import React, { useEffect } from 'react';
import { AvatarDto, ButtonStyleDto, LayoutDto, ReactProps, TierDto } from 'cmap2-shared';
import { InputType } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { avatarSchema } from 'cmap2-shared/src/validationSchemas';
import { useNavigate } from 'react-router-dom';
import { AvatarReducerAction } from "../avatars.reducer";
import useCustomFetch from "../../../shared/hooks/customFetch.hook";
import FormControl from '../../../shared/components/form/formControlBar.component';
import FormInput from "../../../shared/components/form/formInput.component";
import FormTable from '../../../shared/components/form/formTable.component';
import { Content, ContentBox } from 'cmap2-shared/src/components/contentBox.component';
import UploadAvatar from "./uploadAvatar/uploadAvatar.component";
import Parameters from './parameters/parameters.component';
import LayoutComponent from "../layout/layout.component";

interface AvatarProps extends ReactProps {
    selectedAvatar: AvatarDto;
    clientTier: TierDto;
    buttonStyle: ButtonStyleDto;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function Avatar({selectedAvatar, clientTier, buttonStyle, avatarDataDispatch}: AvatarProps) {

    const navigate = useNavigate();
    const customFetch = useCustomFetch();
    const {register, reset, formState: {errors, isDirty}, handleSubmit} = useForm({resolver: zodResolver(avatarSchema)});

    useEffect(() => {
        reset({
            id: selectedAvatar?.id ? selectedAvatar?.id : null,
            vrcId: selectedAvatar?.vrcId,
            label: selectedAvatar?.label,
            default: selectedAvatar?.default ? selectedAvatar?.default : false,
        });
    }, [selectedAvatar]);

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
                navigate('/avatars/' + res.body.id)
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

    return (<>
        <Content flexDirection={'column'}>
            <UploadAvatar />
            {selectedAvatar && <ContentBox>
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
                    <FormControl>
                        <FormInput type={InputType.Submit} disabled={!isDirty} />
                        <FormInput type={InputType.Button} value="Delete" onClick={() => onDelete(selectedAvatar)} />
                    </FormControl>
                </form>
            </ContentBox>}
            {selectedAvatar && <Parameters parameters={selectedAvatar.parameters || []} avatarId={selectedAvatar.id} avatarDataDispatch={avatarDataDispatch}/>}
        </Content>
        {selectedAvatar && selectedAvatar.layouts?.map((layout: LayoutDto, index: number) => (
            <LayoutComponent layout={layout} avatar={selectedAvatar} order={index + 1} key={index} clientTier={clientTier}
                             avatarDataDispatch={avatarDataDispatch} buttonStyle={buttonStyle} />))
        }
        {clientTier?.layouts && selectedAvatar?.id && (!selectedAvatar.layouts || selectedAvatar.layouts.length < clientTier.layouts) &&
            <LayoutComponent layout={new LayoutDto()} avatar={selectedAvatar} order={(selectedAvatar.layouts?.length || 0) + 1}
                             clientTier={clientTier} avatarDataDispatch={avatarDataDispatch} buttonStyle={buttonStyle} />
        }
    </>);
}
