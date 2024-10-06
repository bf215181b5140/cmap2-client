import Segment from '../../../../components/segment/segment.component';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../components/form/formTable.component';
import Input from '../../../../components/input/input.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import React from 'react';
import { TrackedParameterFormDTO, TrackedParameterFormSchema, VrcParameter } from 'cmap2-shared';

export default function SendParameter() {

    const { register, formState: { errors, isDirty }, handleSubmit } = useForm<TrackedParameterFormDTO>({
        resolver: zodResolver(TrackedParameterFormSchema),
        defaultValues: {
            path: '',
            value: ''
        }
    });

    function onSubmit(formData: VrcParameter) {
        window.IPC.send('sendVrcParameter', formData);
    }

    return(<Segment segmentTitle={'Send parameter to VRChat'}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormTable>
                <tr>
                    <td><Input register={register} name={'path'} placeholder={'Parameter'} errors={errors} width={'410px'} /></td>
                    <td><Input register={register} name={'value'} placeholder={'Value'} errors={errors} width={'150px'} /></td>
                    <td><IconButton type={'submit'} role={'normal'} tooltip={'Send parameter'} icon={'ri-contract-right-line'} disabled={!isDirty} /></td>
                </tr>
            </FormTable>
        </form>
    </Segment>)
}