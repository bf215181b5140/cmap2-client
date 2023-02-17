import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import FormInput from './formInput.component';
import { useContext, useEffect, useState } from 'react';
import { InputType, FormField, FormMeta } from 'cmap2-shared';
import { ClientCredentialsContext } from '../../App';
import { ReactProps } from '@/shared/global';
import colors from '../../style/colors.json';

interface FormBuilderProps extends ReactProps {
    name?: string;
    displayLabel?: boolean;
}

export default function FormBuilderComponent({name, displayLabel}: FormBuilderProps) {

    const clientCredentials = useContext(ClientCredentialsContext);
    const [formMeta, setFormMeta] = useState<FormMeta>();
    const {register, formState: {errors}, handleSubmit} = useForm();

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

    function validationMessage(type: string): string {
        switch (type) {
            case 'required':
                return 'This field is required';
                break;
            case 'minLength':
                return 'Too short';
                break;
            case 'maxLength':
                return 'Too long';
                break;
            case 'pattern':
                return 'Can\'t validate this shit';
                break;
        }
        return 'Bad input';
    }

    return (<>{displayLabel && <h1>{formMeta?.label}</h1>}
        {formMeta && <FormStyled onSubmit={handleSubmit(onSubmit, onValidationFail)}>
            <TableStyled>
                <tbody>
                    {formMeta.fields?.sort((a: FormField, b: FormField) => a.order - b.order).map((field: FormField) => (
                        <>
                            <tr>
                                <th>
                                    {field.label}
                                </th>
                                <td>
                                    <FormInput type={field.type} options={field.options} {...register(field.name!, {...fieldOptions(field)})} />
                                </td>
                            </tr>
                            {errors[field.name!] &&
                                <tr>
                                    <td></td>
                                    <ValidationText>
                                        <i className="ri-arrow-up-s-line"> </i><span>{validationMessage(errors[field.name!]?.type?.toString()!)}</span>
                                    </ValidationText>
                                </tr>
                            }
                        </>
                    ))}
                    <tr>
                        <FormInput type={InputType.Submit} />
                    </tr>
                </tbody>
            </TableStyled>
        </FormStyled>}</>);
}

const FormStyled = styled.form`
  //display:flex;
  //flex-direction: column;
`;

const TableStyled = styled.table`
  border: none;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  border-spacing: 0px;

  tr {
    margin: 0;
    padding: 0;
  }

  tr > th {
    margin: 0;
    padding: 0;
    text-align: right;
  }

  tr > td {
    margin: 0;
    padding: 0;
    text-align: left;
  }
`;

const ValidationText = styled.td`
  font-size: 14px;
  color: ${colors['error']};
  text-indent: 15px;
`;
