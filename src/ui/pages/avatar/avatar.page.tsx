import styled from 'styled-components';
import ContentBox from '../../components/contentBox.component';
import { useEffect } from 'react';
import Content from '../../components/content.component';
import colors from '../../style/colors.json';
import { AvatarDto, LayoutDto } from 'cmap2-shared';
import FormInput from '../../components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { avatarSchema } from 'cmap2-shared/src/validationSchemas';
import LayoutComponent from '../../components/layout.component';
import useAvatarPage from './avatar.hook';
import { useNavigate, useParams } from 'react-router-dom';
import { SidePanel, SidePanelButton } from '../../components/SidePanel.component';
import ButtonComponent from '../../components/button.component';
import useCustomFetch from '../../hooks/customFetch.hook';

export default function AvatarPage() {

    const navigate = useNavigate();
    const customFetch = useCustomFetch();
    const {avatars, avatarDataDispatch, selectedAvatar, selectedLayout, selectedButton} = useAvatarPage();
    const {register, setValue, formState: {errors}, handleSubmit} = useForm({resolver: zodResolver(avatarSchema)});

    // set form fields
    useEffect(() => {
        setValue('id', selectedAvatar?.id ? selectedAvatar?.id : null);
        setValue('vrcId', selectedAvatar?.vrcId);
        setValue('label', selectedAvatar?.label);
        setValue('default', selectedAvatar?.default ? selectedAvatar?.default : false);
    }, [selectedAvatar]);

    if (selectedAvatar && selectedLayout && selectedButton) {
        return (<ButtonComponent button={selectedButton} avatar={selectedAvatar} layout={selectedLayout} avatarDataDispatch={avatarDataDispatch} />)
    }

    function onSave(formData: any) {
        customFetch('avatar', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData)
        }).then(res => {
            if (res?.code === 200) avatarDataDispatch({type: 'editAvatar', avatar: formData});
            if (res?.code === 201) avatarDataDispatch({type: 'addAvatar', avatar: res.body});
        });
    }

    function onDelete(avatar: AvatarDto) {
        customFetch('avatar', {
            method: 'DELETE',
            body: JSON.stringify(avatar.id)
        }).then(res => {
            if (res?.code === 200) avatarDataDispatch({type: 'removeAvatar', avatar: avatar});
        });
    }

    return (<>
        <SidePanel title={'Avatars'} icon={'ri-contacts-book-fill'}>
            {avatars && avatars.map((avatar: AvatarDto) => (
                <SidePanelButton active={selectedAvatar && selectedAvatar.id === avatar.id} onClick={() => navigate('/avatar/' + avatar.id)} key={avatar.id}>{avatar.label}</SidePanelButton>
            ))}
            <SidePanelButton className={'addButton'} onClick={() => navigate('/avatar/new')}><i className={'ri-add-fill'}></i></SidePanelButton>
        </SidePanel>
        <Content flexDirection={'column'}>
            {selectedAvatar && <ContentBox>
                <form onSubmit={handleSubmit(onSave)}>
                    <FormInput type={InputType.Hidden} register={register} name={'id'} />
                    <table>
                        <tbody>
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
                        <tr>
                            <td><FormInput type={InputType.Submit} /></td>
                            <td><FormInput type={InputType.Button} value="Delete" onClick={() => onDelete} /></td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </ContentBox>}
            {selectedAvatar && selectedAvatar.layouts?.map((layout: LayoutDto, index: number) => (
                <LayoutComponent layout={layout} avatar={selectedAvatar} order={index + 1} key={index} avatarDataDispatch={avatarDataDispatch} />))
            }
            {selectedAvatar &&
                <LayoutComponent layout={new LayoutDto()} avatar={selectedAvatar} order={selectedAvatar.layouts?.length + 1} avatarDataDispatch={avatarDataDispatch} />
            }
        </Content>
    </>);
}
