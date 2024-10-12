import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import { TrackedParameterFormDTO, TrackedParameterFormSchema, VrcParameter } from 'cmap2-shared';
import Segment from '../../../../components/segment/segment.component';
import FormTable from '../../../../components/form/formTable.component';
import Input from '../../../../components/input/input.component';
import FormControlBar from '../../../../components/form/formControlBar.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import TypedEmitter from 'typed-emitter/rxjs';
import { ParametersPageEmitter } from '../types/parametersPageEmitter';

interface ParameterEditForm {
    parametersPageEmitter: TypedEmitter<ParametersPageEmitter>;
}

export default function ParameterEdit({ parametersPageEmitter }: ParameterEditForm) {

    const { POST, DELETE } = useCmapFetch();
    const scrollRef = useRef<HTMLFormElement>(null);
    const { register, watch, reset, formState: { errors, isDirty }, handleSubmit } = useForm<TrackedParameterFormDTO>({
        resolver: zodResolver(TrackedParameterFormSchema),
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
        parametersPageEmitter.on('selectParameter', resetListener);

        return () => {
            parametersPageEmitter.removeListener('selectParameter', resetListener);
        };
    }, []);

    function onSubmit(formData: VrcParameter) {
        POST('trackedParameters/parameter', formData, undefined, () => {
            parametersPageEmitter.emit('saveParameter', formData);
            window.IPC.send('setTrackedParameter', formData);
            reset({
                path: formData.path,
                value: formData.value.toString()
            });
        });
    }

    function onDelete() {
        const parameter = watch('path');
        DELETE('trackedParameters/parameter', { path: parameter }, undefined, () => {
            parametersPageEmitter.emit('deleteParameter', parameter);
            window.IPC.send('deleteTrackedParameter', parameter);
            reset({
                path: '',
                value: ''
            });
        });
    }

    return (<Segment segmentTitle={'Edit parameter'}>
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
