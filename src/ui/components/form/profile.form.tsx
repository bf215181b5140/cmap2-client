import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import Input from './input.component';

export default function ProfileForm() {

    const {register, handleSubmit} = useForm();

    function onSubmit(data: any) {
        console.log('form data submitted: ', data)
    }

    return (<ProfileFormStyled onSubmit={handleSubmit(onSubmit)}>
        <Input inputType="text" label="Display name" formProps={{...register('displayName', { required: true })}} />
        <Input inputType="textarea" label="Description" formProps={{...register('description')}} />
        <Input inputType="checkbox" label="Hidden" formProps={{...register('hidden')}} />
        <Input inputType="submit" />
    </ProfileFormStyled>);
}

const ProfileFormStyled = styled.form`
  //display:flex;
  //flex-direction: column;
`;
