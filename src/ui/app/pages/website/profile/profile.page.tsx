import { ContentBox, Content } from 'cmap2-shared/dist/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useProlfilePage from './profile.hook';
import FileUpload from '../../../shared/components/fileUpload.component';
import styled from 'styled-components';
import TierBadge from './components/tierBadge.component';
import ButtonStylePicker from './buttonStylePicker/buttonStylePicker';
import BackgroundPicker from './backgroundPicker/backgroundPicker.component';
import { URL } from '../../../../../shared/const';
import FormTable from '../../../shared/components/form/formTable.component';
import FormControlBar from '../../../shared/components/form/formControlBar.component';
import SubmitInput from '../../../shared/components/form/inputs/submit.component';
import CheckboxInput from '../../../shared/components/form/inputs/checkbox.component';
import Input from '../../../shared/components/form/inputs/input.component';
import TextareaInput from '../../../shared/components/form/inputs/textarea.component';
import { ProfileFormSchema } from 'cmap2-shared';

export default function ProfilePage() {

    const {client, backgrounds, buttonStyles, onSubmit, setClientPicture, setClientBackground, setClientButtonStyle} = useProlfilePage();
    const {register, reset, formState: {errors, isDirty}, handleSubmit} = useForm({resolver: zodResolver(ProfileFormSchema)});

    useEffect(() => {
        reset({
            displayName: client?.displayName,
            bio: client?.bio,
            hidden: client?.hidden
        });
    }, [client]);

    return (
        <Content>
            <ContentBox flexGrow={1} loading={!client}>
                {client && <>
                    {client.image?.urlPath && <ProfilePictureStyled src={URL + '/' + client.image.urlPath} alt="Profile picture" />}
                    <br />
                    <FileUpload parentType="profile" parentId={client.id!} uploadCallback={setClientPicture} />
                    <br />
                    {client.tier && <>
                        <h3>Account tier</h3>
                        <TierBadge tier={client.tier} />
                    </>}
                </>}
            </ContentBox>
            <ContentBox loading={!client}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormTable>
                        <tr>
                            <th>Display name</th>
                            <td><Input register={register} name={'displayName'} errors={errors} /></td>
                        </tr>
                        <tr>
                            <th>Bio</th>
                            <td><TextareaInput register={register} name={'bio'} errors={errors} width={'500px'} /></td>
                        </tr>
                        <tr>
                            <th>Hide profile</th>
                            <td><CheckboxInput register={register} name={'hidden'} errors={errors} /></td>
                        </tr>
                    </FormTable>
                    <FormControlBar><SubmitInput disabled={!isDirty} /></FormControlBar>
                </form>
            </ContentBox>
            <BackgroundPicker client={client} setFunction={setClientBackground} backgrounds={backgrounds} />
            <ButtonStylePicker client={client} setFunction={setClientButtonStyle} buttonStyles={buttonStyles} />
        </Content>
    );
}

const ProfilePictureStyled = styled.img`
  width: 100%;
  border: 3px solid ${props => props.theme.colors.ui.element3};
  border-radius: 8px;
  box-sizing: border-box;
  display: block;
`;

