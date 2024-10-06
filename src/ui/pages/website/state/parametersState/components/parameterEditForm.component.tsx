import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { ClientStateParameterFormDTO, ClientStateParameterFormSchema, VrcParameter, } from 'cmap2-shared';
import Segment from '../../../../../components/segment/segment.component';
import FormTable from '../../../../../components/form/formTable.component';
import Input from '../../../../../components/input/input.component';
import FormControlBar from '../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../components/buttons/iconButton.component';
import TypedEmitter from 'typed-emitter/rxjs';
import { StatePageEmitter } from '../types/statePageEmitter';

interface ParameterEditForm {
    statePageEmitter: TypedEmitter<StatePageEmitter>;
}

export default function ParameterEditForm({ statePageEmitter }: ParameterEditForm) {

    const { POST, DELETE } = useCmapFetch();
    const scrollRef = useRef<HTMLFormElement>(null);
    const { register, watch, reset, formState: { errors, isDirty }, handleSubmit } = useForm<ClientStateParameterFormDTO>({
        resolver: zodResolver(ClientStateParameterFormSchema),
        defaultValues: {
            path: '',
            value: ''
        }
    });

    useEffect(() => {
        const resetListener = (parameter: VrcParameter) => {
            reset({
                path: parameter.path,
                value: parameter.value?.toString()
            });
            scrollRef.current?.scrollIntoView();
        };
        statePageEmitter.on('selectParameter', resetListener);

        return () => {
            statePageEmitter.removeListener('selectParameter', resetListener);
        };
    }, []);

    function onSubmit(formData: ClientStateParameterFormDTO) {
        POST('state/parameter', formData, undefined, () => {
            statePageEmitter.emit('saveParameter', formData);
            window.IPC.send('setTrackedParameter', formData);
            reset({
                path: formData.path,
                value: formData.value.toString()
            });
        });
    }

    function onDelete() {
        const parameter = watch('path');
        DELETE('state/parameter', { path: parameter }, undefined, () => {
            statePageEmitter.emit('deleteParameter', parameter);
            window.IPC.send('deleteTrackedParameter', parameter);
            reset({
                path: '',
                value: ''
            });
        });
    }

    return (<Segment flexBasis={'Full'} segmentTitle={'Edit parameter'}>
        <form onSubmit={handleSubmit(onSubmit)} ref={scrollRef}>
            <FormTable>
                <tr>
                    <td><Input register={register} name={'path'} placeholder={'Parameter'} errors={errors} width={'350px'} /></td>
                    <td><Input register={register} name={'value'} placeholder={'Value'} errors={errors} width={'200px'} /></td>
                    <td></td>
                </tr>
            </FormTable>
            <FormControlBar>
                <IconButton role={'save'} disabled={!isDirty} />
                <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
                <IconButton role={'delete'} disabled={!watch('path')} deleteKeyword={'parameter'} onClick={() => onDelete()} />
            </FormControlBar>
        </form>
    </Segment>);
}
