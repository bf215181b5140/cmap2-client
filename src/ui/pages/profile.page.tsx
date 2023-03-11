import styled from 'styled-components';
import ContentBox from '../components/contentBox.component';
import { useContext, useEffect, useState } from 'react';
import { ClientCredentialsContext } from '../App';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from 'cmap2-shared/dist/validationSchemas';
import FormInput from '../components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import { ClientDto } from 'cmap2-shared/dist/dtos';
import Content from '../components/content.component';

export default function ProfilePage() {

    const clientCredentials = useContext(ClientCredentialsContext); // todo
    const [profileData, setProfileData] = useState<any>();

    const {register, setValue, formState: {errors}, handleSubmit} = useForm({
        resolver: zodResolver(profileSchema)
    });

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(clientCredentials.serverUrl + '/api/profile/' + clientCredentials.username, {method: 'GET'});
            const resData = await res.json() as ClientDto;
            console.log('Recieved /api/profile/readProfile: ', resData);
            setProfileData(resData);
            setValue('displayName', resData.displayName);
            setValue('bio', resData.bio);
            setValue('hidden', resData.hidden);
        };
        fetchData();
    }, []);

    function onSubmit(formData: any) {
        console.log(formData);
        fetch(clientCredentials.serverUrl + '/api/profile/' + clientCredentials.username, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'jwt': 'jwt-token' // TODO
            },
            body: JSON.stringify(formData)
        }).then((res) => console.log('/api/profile/ post response:', res)).catch((err) => console.log('/api/profile/ post error:', err));
    }

    return (
        <Content>
            <ContentBox flex={1}>
                <img src={profileData?.picture} alt="Profile picture" />
                <p>Account type or status</p>
            </ContentBox>
            <ContentBox>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <table>
                        <tbody>
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
                        <tr>
                            <td colSpan={2}><FormInput type={InputType.Submit} /></td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </ContentBox>
        </Content>
    );
}

// const ProfilePageStyled = styled.div`
//   margin: 20px;
//   display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
//   align-items: flex-start;
//   gap: 20px;
// `;
