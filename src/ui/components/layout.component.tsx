import ContentBox from '../components/contentBox.component';
import { ReactProps } from '@/shared/global';
import { ButtonDto, LayoutDto } from 'cmap2-shared/dist/dtos';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { avatarSchema } from 'cmap2-shared/src/validationSchemas';
import { Form, useNavigate } from 'react-router-dom';
import FormInput from '../components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import { useContext, useEffect } from 'react';
import { ClientCredentialsContext } from '../App';
import { layoutSchema } from 'cmap2-shared/dist/validationSchemas';

interface LayoutComponentProps extends ReactProps {
    layout: LayoutDto;
    order: number;
    avatarId?: string;
}

export default function LayoutComponent(props: LayoutComponentProps) {

    const clientCredentials = useContext(ClientCredentialsContext);
    const {register, setValue, formState, handleSubmit} = useForm({resolver: zodResolver(layoutSchema)});
    const navigate = useNavigate();

    useEffect(() => {
        setValue('id', props.layout.id);
        setValue('label', props.layout.label);
        setValue('order', props.order);
        setValue('avatar', props.avatarId);
    }, []);

    function onSubmit(formData: any) {
        console.log('submitted data:', formData);
        fetch(clientCredentials.serverUrl + '/api/layout/' + clientCredentials.username, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'jwt': 'jwt-token' // TODO
            },
            body: JSON.stringify(formData)
        }).then((res) => console.log('/api/layout/ post response:', res)).catch((err) => console.log('/api/layout/ post error:', err));
    }

    return (<ContentBox>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput type={InputType.Hidden} register={register} name={'id'} />
            <FormInput type={InputType.Text} register={register} name={'label'} errors={formState.errors}/>
            <FormInput type={InputType.Hidden} register={register} name={'order'} />
            <FormInput type={InputType.Hidden} register={register} name={'avatar'} />
            {formState.isDirty && <FormInput type={InputType.Submit} />}
        </form>
        <hr />
        {props.layout.buttons.map((button: ButtonDto) => (
            <button onClick={() => navigate('/button/' + button.id)} key={button.id}>{button.label}</button>
        ))}
    </ContentBox>);
}