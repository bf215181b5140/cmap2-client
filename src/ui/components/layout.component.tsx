import ContentBox from '../components/contentBox.component';
import { ReactProps } from '@/shared/global';
import { ButtonDto, LayoutDto } from 'cmap2-shared/dist/dtos';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { avatarSchema } from 'cmap2-shared/src/validationSchemas';
import { Form, useNavigate } from 'react-router-dom';
import FormInput from '../components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ClientCredentialsContext } from '../App';
import { layoutSchema } from 'cmap2-shared/dist/validationSchemas';
import styled from 'styled-components';
import { Layout } from '@/shared/clientData';

interface LayoutComponentProps extends ReactProps {
    layout: LayoutDto;
    order: number;
    avatarId?: string;
}

export default function LayoutComponent(props: LayoutComponentProps) {

    const clientCredentials = useContext(ClientCredentialsContext);
    const {register, formState: {errors, isDirty, submitCount}, reset, handleSubmit} = useForm({resolver: zodResolver(layoutSchema)});
    const navigate = useNavigate();
    const [inEdit, setEditing] = useState<boolean>(false);

    const resetForm = useCallback(() => {
        reset({
            id: props.layout.id,
            label: props.layout.label,
            order: props.order,
            parentId: props.avatarId
        });
    }, []);

    useEffect(() => {
        resetForm();
    }, []);

    function onSubmit(formData: any) {
        // formData.parentId = props.avatarId;
        console.log('onSubmit layout:', formData);
        fetch(clientCredentials.serverUrl + '/api/layout/' + clientCredentials.username, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'jwt': 'jwt-token' // TODO
            },
            body: JSON.stringify(formData)
        }).then((res) => console.log('/api/layout/ post response:', res)).catch((err) => console.log('/api/layout/ post error:', err));

        // todo if fetch success
        // todo what happens when new one is added
        props.layout.label = formData.label;
        resetForm();
        setEditing(false);
    }

    return (<ContentBox>
        {!inEdit && <>
            {props.layout.id && <LayoutLabel>{props.layout.label}</LayoutLabel>}
            <FormInput type={InputType.Button} value={props.layout.id ? 'Edit' : 'Add new'} onClick={() => setEditing(true)}></FormInput>
        </>}
        {inEdit && <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput type={InputType.Hidden} register={register} name={'id'} />
            <FormInput type={InputType.Text} register={register} name={'label'} errors={errors} />
            <FormInput type={InputType.Hidden} register={register} name={'order'} />
            <FormInput type={InputType.Hidden} register={register} name={'parentId'} />
            <FormInput type={InputType.Submit} />
            <FormInput type={InputType.Button} value={'Cancel'} onClick={() => {
                resetForm();
                setEditing(false);
            }}></FormInput>
            <p>{errors?.id?.message?.toString()}</p>
        </form>}
        <hr />
        {props.layout.buttons?.map((button: ButtonDto) => (
            <button onClick={() => navigate('/button/' + props.avatarId + '/' + props.layout.id + '/' + button.id)} key={button.id}>{button.label}</button>
        ))}
    </ContentBox>);
}

const LayoutLabel = styled.h2`
  margin: 7px;
  font-size: 20px;
  display: inline-block;
`;
