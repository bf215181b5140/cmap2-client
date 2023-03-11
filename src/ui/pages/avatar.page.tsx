import styled from 'styled-components';
import ContentBox from '../components/contentBox.component';
import { useContext, useEffect, useState } from 'react';
import { ClientCredentialsContext } from '../App';
import Content from '../components/content.component';
import colors from '../style/colors.json';
import { AvatarDto, ButtonDto, LayoutDto } from 'cmap2-shared/dist/dtos';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { avatarSchema } from 'cmap2-shared/src/validationSchemas';
import LayoutComponent from '../components/layout.component';

export default function AvatarPage() {

    const clientCredentials = useContext(ClientCredentialsContext);
    const [avatars, setavatars] = useState<AvatarDto[]>();
    const [selectedAvatar, setSelectedAvatar] = useState<AvatarDto | null>(null);
    const {register, setValue, formState: {errors}, handleSubmit} = useForm({resolver: zodResolver(avatarSchema)});

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(clientCredentials.serverUrl + '/api/avatar/' + clientCredentials.username, {method: 'GET'});
            const resData = await res.json() as AvatarDto[];
            console.log('Recieved /api/avatar/readAvatars: ', resData);
            setavatars(resData);
        };
        fetchData();
    }, []);

    function pickAvatar(avatar: AvatarDto | null) {
        setSelectedAvatar(avatar);
        setValue('id', avatar?.id);
        setValue('vrcId', avatar?.vrcId);
        setValue('label', avatar?.label);
        setValue('default', avatar?.default);
        setValue('order', avatar?.order);
    }

    function onSubmit(formData: any) {
        console.log(formData);
        fetch(clientCredentials.serverUrl + '/api/avatar/' + clientCredentials.username, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'jwt': 'jwt-token' // TODO
            },
            body: JSON.stringify(formData)
        }).then((res) => console.log('/api/avatar/ post response:', res)).catch((err) => console.log('/api/avatar/ post error:', err));
    }

    return (<>
        <SidePanel>
            <h2>Avatars</h2>
            {avatars && avatars.map((avatar: AvatarDto) => (
                <button onClick={() => pickAvatar(avatar)} key={avatar.id}>{avatar.label}</button>
            ))}
            <button className={'addButton'} onClick={() => pickAvatar(null)}><i className={'ri-add-fill'}></i></button>
        </SidePanel>
        <Content flexDirection={'column'}>
            {selectedAvatar && <ContentBox>
                <h1>{selectedAvatar.label}</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <table>
                        <tbody>
                        {/* TODO HIDDEN FIELDS */}
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
                            <th>Order</th>
                            <td>
                                <FormInput type={InputType.Select} register={register} name={'order'} errors={errors}
                                           options={avatars && avatars.map((x, index) => ({key: (index + 1).toString(), value: (index + 1).toString()}))} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}><FormInput type={InputType.Submit} /></td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </ContentBox>}
            {selectedAvatar && selectedAvatar.layouts.map((layout: LayoutDto, index) => (
                <LayoutComponent layout={layout} avatarId={selectedAvatar?.id} order={index + 1} />))}
        </Content>
    </>);
}

const SidePanel = styled.div`
  margin: 0 20px 0 0;
  padding: 0 7px;
  width: 166px;
  height: 100%;
  float: left;
  background-color: ${colors['ui-background-3']};

  h2 {
    margin: 5px 5px 15px 5px;
  }

  button {
    font-family: Dosis-Bold, sans-serif;
    margin: 7px 0;
    padding: 7px;
    display: block;
    width: 100%;
    color: ${colors['text-1']};
    background: ${colors['ui-primary-1']};
    border: 2px solid ${colors['ui-primary-2']};
    border-radius: 7px;
    font-size: 16px;
    transition: 0.15s linear;

    :hover {
      //transform: scale(1.05) perspective(1px);
      background: ${colors['ui-primary-3']};
      border: 2px solid ${colors['ui-primary-4']};
    }
  }

  button.addButton {
    background: ${colors['ui-background-3']};

    i {
      font-size: 24px;
    }
  }
`;
