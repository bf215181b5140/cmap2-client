import styled from 'styled-components';
import ContentBox from '../../components/contentBox.component';
import { useEffect } from 'react';
import Content from '../../components/content.component';
import colors from '../../style/colors.json';
import { AvatarDto, LayoutDto } from 'cmap2-shared/dist/dtos';
import FormInput from '../../components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { avatarSchema } from 'cmap2-shared/src/validationSchemas';
import LayoutComponent from '../../components/layout.component';
import useAvatarPage from './avatar.hook';

export default function AvatarPage() {

    const {avatars, selectedAvatar, setSelectedAvatar, onSubmit, addChild, removeChild} = useAvatarPage();
    const {register, setValue, formState: {errors}, handleSubmit} = useForm({resolver: zodResolver(avatarSchema)});

    // set form fields
    useEffect(() => {
        setValue('id', selectedAvatar?.id ? selectedAvatar?.id : null);
        setValue('vrcId', selectedAvatar?.vrcId);
        setValue('label', selectedAvatar?.label);
        setValue('default', selectedAvatar?.default ? selectedAvatar?.default : false);
    }, [selectedAvatar]);

    return (<>
        <SidePanel>
            <h2>Avatars</h2>
            {avatars && avatars.map((avatar: AvatarDto) => (
                <button onClick={() => setSelectedAvatar(avatar)} key={avatar.id}>{avatar.label}</button>
            ))}
            <button className={'addButton'} onClick={() => setSelectedAvatar(new AvatarDto())}><i className={'ri-add-fill'}></i></button>
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
