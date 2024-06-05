import FormTable from '../../../../../shared/components/form/formTable.component';
import FormControlBar from '../../../../../shared/components/form/formControlBar.component';
import IconButton from '../../../../../shared/components/buttons/iconButton.component';
import React from 'react';
import Input from '../../../../../shared/components/form/inputs/input.component';
import useCmapFetch from '../../../../../shared/hooks/cmapFetch.hook';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { ClientStateParamDTO, ClientStateParamSchema, ContentBoxWidth } from 'cmap2-shared';
import ContentBox from '../../../../../shared/components/contentBox/contentBox.component';

interface ParameterEditForm {
    parameter: string;
}

export default function ParameterEditForm({ parameter }: ParameterEditForm) {

    const customFetch = useCmapFetch();
    const { register, reset, formState: { errors, isDirty }, handleSubmit } = useForm<ClientStateParamDTO>({
        resolver: zodResolver(ClientStateParamSchema),
        defaultValues: {
            parameter: parameter,
            value: ''
        }
    });

    function onSubmit(formData: ClientStateParamDTO) {
    }

    return (<ContentBox flexBasis={ContentBoxWidth.Full} contentTitle={'Edit parameter'}>
        <h2>Editing parameter</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormTable>
                <tr>
                    <td><Input register={register} name={'parameter'} errors={errors} readOnly={true} width={'450px'} /></td>
                    <td><Input register={register} name={'value'} errors={errors} /></td>
                    <td>
                        <IconButton role={'save'} disabled={!isDirty} />
                        <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
                    </td>
                </tr>
            </FormTable>
        </form>
    </ContentBox>);
}
