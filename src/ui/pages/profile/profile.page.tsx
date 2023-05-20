import { ContentBox, Content } from 'cmap2-shared/dist/react';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from 'cmap2-shared/src/zodSchemas';
import FormInput from '../../shared/components/form/formInput.component';
import { ClientTier, InputType } from 'cmap2-shared';
import useProlfilePage from './profile.hook';
import FileUpload from '../../shared/components/fileUpload.component';
import { ClientCredentialsContext } from '../../app/App';
import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import TierBadge from './components/tierBadge.component';
import ButtonStylePicker from './buttonStylePicker/buttonStylePicker';
import BackgroundPicker from './backgroundPicker/backgroundPicker.component';
import { URL } from '../../../shared/const';
import FormTable from '../../shared/components/form/formTable.component';
import FormControlBar from '../../shared/components/form/formControlBar.component';

export default function ProfilePage() {

    const {client, backgrounds, buttonStyles, onSubmit, setClientPicture, setClientBackground, setClientButtonStyle} = useProlfilePage();
    const {register, reset, formState: {errors, isDirty}, handleSubmit} = useForm({resolver: zodResolver(profileSchema)});

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
                    <ProfilePictureStyled src={URL + '/' + client.image} alt="Profile picture" />
                    <br />
                    <FileUpload parentType="profile" parentId={client.id} uploadCallback={setClientPicture} />
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
                            <td><FormInput type={InputType.Text} register={register} name={'displayName'} errors={errors} /></td>
                        </tr>
                        <tr>
                            <th>Bio</th>
                            <td><FormInput type={InputType.Textarea} register={register} name={'bio'} errors={errors} /></td>
                        </tr>
                        <tr>
                            <th>Hide profile</th>
                            <td><FormInput type={InputType.Boolean} register={register} name={'hidden'} errors={errors} /></td>
                        </tr>
                    </FormTable>
                    <FormControlBar><FormInput type={InputType.Submit} disabled={!isDirty} /></FormControlBar>
                </form>
            </ContentBox>
            <BackgroundPicker client={client} setFunction={setClientBackground} backgrounds={backgrounds} />
            <ButtonStylePicker client={client} setFunction={setClientButtonStyle} buttonStyles={buttonStyles} />
        </Content>
    );
}

const ProfilePictureStyled = styled.img`
  width: 100%;
  border: 3px solid ${colors['ui-primary-1']};
  border-radius: 8px;
  box-sizing: border-box;
  display: block;
`;

