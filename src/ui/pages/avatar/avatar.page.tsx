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
import { useParams } from "react-router-dom";
import { SidePanel, SidePanelButton } from '../../components/SidePanel.component';

export default function AvatarPage() {

    const routeParams = useParams();
    const {avatars, selectedAvatar, setSelectedAvatar, onSubmit, addChild, removeChild} = useAvatarPage();
    const {register, setValue, formState: {errors}, handleSubmit} = useForm({resolver: zodResolver(avatarSchema)});

    // set form fields
    useEffect(() => {
        console.log('AvatarPage useEffect [selectedAvatar]');
        setValue('id', selectedAvatar?.id ? selectedAvatar?.id : null);
        setValue('vrcId', selectedAvatar?.vrcId);
        setValue('label', selectedAvatar?.label);
        setValue('default', selectedAvatar?.default ? selectedAvatar?.default : false);
    }, [selectedAvatar]);

    console.log('AvatarPage');

    return (<>
        <SidePanel title={'Avatars'} icon={'ri-contacts-book-fill'}>
            {avatars && avatars.map((avatar: AvatarDto) => (
                <SidePanelButton active={selectedAvatar && selectedAvatar.id === avatar.id} onClick={() => setSelectedAvatar(avatar)} key={avatar.id}>{avatar.label}</SidePanelButton>
            ))}
            <SidePanelButton className={'addButton'} onClick={() => setSelectedAvatar(new AvatarDto())}><i className={'ri-add-fill'}></i></SidePanelButton>
        </SidePanel>
        <Content flexDirection={'column'}>
            {selectedAvatar && <ContentBox>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormInput type={InputType.Hidden} register={register} name={'id'} />
                    {errors?.id?.message?.toString()}
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
                            <td colSpan={2}><FormInput type={InputType.Submit} /></td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </ContentBox>}
            {selectedAvatar && selectedAvatar.layouts?.map((layout: LayoutDto, index: number) => (
                <LayoutComponent layout={layout} avatarId={selectedAvatar?.id} order={index + 1} key={index} removeChild={removeChild} />))
            }
            {selectedAvatar &&
                <LayoutComponent layout={new LayoutDto()} avatarId={selectedAvatar?.id} order={selectedAvatar.layouts?.length + 1} addChild={addChild} />
            }
        </Content>
    </>);
}
