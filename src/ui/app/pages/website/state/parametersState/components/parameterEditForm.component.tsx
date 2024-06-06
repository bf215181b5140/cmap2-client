import FormTable from '../../../../../shared/components/form/formTable.component';
import IconButton from '../../../../../shared/components/buttons/iconButton.component';
import React, { useEffect } from 'react';
import Input from '../../../../../shared/components/form/inputs/input.component';
import useCmapFetch from '../../../../../shared/hooks/cmapFetch.hook';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { ClientStateParamDTO, ClientStateParamFormSchema, ClientStateParamsDTO, ContentBoxWidth } from 'cmap2-shared';
import ContentBox from '../../../../../shared/components/contentBox/contentBox.component';
import { EventEmitter } from 'events';
import FormControlBar from '../../../../../shared/components/form/formControlBar.component';

interface ParameterEditForm {
    statePageEmitter: EventEmitter;
}

export default function ParameterEditForm({statePageEmitter}: ParameterEditForm) {

    const cmapFetch = useCmapFetch();
    const {register, watch, reset, formState: {errors, isDirty}, handleSubmit} = useForm<ClientStateParamDTO>({
        resolver: zodResolver(ClientStateParamFormSchema),
        defaultValues: {
            path: '',
            value: ''
        }
    });

    useEffect(() => {
        const resetListener = (parameter: string | undefined) => {
            reset({
                path: parameter || '',
                value: ''
            })
        };

        statePageEmitter.on('selectedParameter', resetListener)

        return () => {
            statePageEmitter.removeListener('selectedParameter', resetListener)
        }
    }, [])

    function onSubmit(formData: ClientStateParamDTO) {
        cmapFetch<ClientStateParamsDTO>('clientState/parameter', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }, (parameters) => {
            statePageEmitter.emit('parameters', parameters);
            window.electronAPI.send('setTrackedParameter', formData);
            reset();
        });
    }

    function onDelete() {
        const deleteParameter: ClientStateParamDTO = {
            path: watch('path'),
            value: true,
        }
        cmapFetch<ClientStateParamsDTO>('clientState/parameter', {
            method: 'DELETE',
            body: JSON.stringify(deleteParameter),
            headers: {'Content-Type': 'application/json'}
        }, (parameters) => {
            statePageEmitter.emit('parameters', parameters);
            window.electronAPI.send('deleteTrackedParameter', deleteParameter);
            reset({
                path: '',
                value: ''
            });
        });
    }

    return (<ContentBox flexBasis={ContentBoxWidth.Full} contentTitle={'Edit parameter'}>
        <h2>Editing parameter</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormTable>
                <tr>
                    <td><Input register={register} name={'path'} errors={errors} width={'450px'} /></td>
                    <td><Input register={register} name={'value'} errors={errors} /></td>
                    <td>
                        <FormControlBar>
                            <IconButton role={'save'} disabled={!isDirty} />
                            <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
                            <hr />
                            <IconButton role={'delete'} size={'tiny'} deleteKeyword={'parameter'} onClick={() => onDelete()} />
                        </FormControlBar>
                    </td>
                </tr>
            </FormTable>
        </form>
    </ContentBox>);
}
