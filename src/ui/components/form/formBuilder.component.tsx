import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import Input from './input.component';
import { useContext, useEffect, useState } from 'react';
import { FormField, FormMeta } from 'cmap2-shared';
import { ClientCredentialsContext } from '../../App';
import { ReactProps } from '@/shared/global';

interface FormBuilderProps extends ReactProps {
    name?: string;
    displayLabel?: boolean;
}

export default function FormBuilderComponent({name, displayLabel}: FormBuilderProps) {

    const clientCredentials = useContext(ClientCredentialsContext);
    const [formMeta, setFormMeta] = useState<FormMeta>();
    const {register, handleSubmit} = useForm();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(clientCredentials.serverUrl + '/api/form/' + name);
            const resData = await res.json() as FormMeta;
            console.log('Recieved data from server for form: ', resData);
            setFormMeta(resData);
        };

        fetchData();
    }, []);

    async function onSubmit(formData: any) {
        console.log('form data submitted: ', formData);

        const body = JSON.stringify(formData);
        console.log('formData as json: ', body);
        const res = await fetch(clientCredentials.serverUrl + '/api/form/' + name, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'jwt': 'jwt-token'
            },
            body: body
        });

        const resData = await res.json();
        console.log('response from post form request: ', resData);
    }

    function onValidationFail(formData: any) {
        console.log('validation failed, form data:', formData);
    }

    function fieldOptions(field: FormField) {
        let options: { [key: string]: any; } = {
            required: field.required!,
            minLength: field.minLength!,
            maxLength: field.maxLength!
        };
        if (field.pattern) options['pattern'] = RegExp(field.pattern);
        return options;
    }

    return (<>{displayLabel && <h1>{formMeta?.label}</h1>}
        <FormStyled onSubmit={handleSubmit(onSubmit, onValidationFail)}>
            {formMeta && formMeta.fields?.map((field: FormField) => (
                <Input inputType={field.type} label={field.label} formProps={{
                    ...register(field.name!, {
                        ...fieldOptions(field)
                    })
                }} />
            ))}
            <Input inputType="submit" />
        </FormStyled></>);
}

const FormStyled = styled.form`
  //display:flex;
  //flex-direction: column;
`;
