import Segment from '../../../../components/segment/segment.component';
import { useForm } from 'react-hook-form';
import { ClientStateParameterFormDTO, ClientStateParameterFormSchema } from 'cmap2-shared';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../components/form/formTable.component';
import Input from '../../../../components/input/input.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import React from 'react';

export default function SendParameter() {

    const { register, watch, reset, formState: { errors, isDirty }, handleSubmit } = useForm<ClientStateParameterFormDTO>({
        resolver: zodResolver(ClientStateParameterFormSchema),
        defaultValues: {
            path: '',
            value: ''
        }
    });

    function onSubmit(formData: ClientStateParameterFormDTO) {
        window.IPC.send('sendVrcParameter', formData);
    }

    return(<Segment segmentTitle={'Send parameter to VRChat'}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormTable>
                <tr>
                    <td><Input register={register} name={'path'} placeholder={'Parameter'} errors={errors} width={'410px'} /></td>
                    <td><Input register={register} name={'value'} placeholder={'Value'} errors={errors} width={'150px'} /></td>
                    <td><IconButton type={'submit'} role={'normal'} tooltip={'Send parameter'} disabled={!isDirty} /></td>
                </tr>
            </FormTable>
        </form>
    </Segment>)
}