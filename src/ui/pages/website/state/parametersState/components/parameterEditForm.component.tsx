import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventEmitter } from 'events';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { ClientStateParameterFormDTO, ClientStateParameterFormSchema, } from 'cmap2-shared';
import Segment from '../../../../../components/segment/segment.component';
import FormTable from '../../../../../components/form/formTable.component';
import Input from '../../../../../components/input/input.component';
import FormControlBar from '../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../components/buttons/iconButton.component';

interface ParameterEditForm {
    statePageEmitter: EventEmitter;
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
        const resetListener = (parameter: string) => {
            reset({
                path: parameter,
                value: ''
            });
            scrollRef.current?.scrollIntoView();
        };

        statePageEmitter.on('selectedParameter', resetListener);

        return () => {
            statePageEmitter.removeListener('selectedParameter', resetListener);
        };
    }, []);

    function onSubmit(formData: ClientStateParameterFormDTO) {
        POST('state/parameter', formData, undefined, () => {
            statePageEmitter.emit('setParameter', formData);
            // window.IPC.send('setTrackedParameter', formData);
            reset(formData);
        });
    }

    function onDelete() {
        // const deleteParameter: ClientStateParameterDTO = {
        //     path: watch('path'),
        //     value: true,
        // };
    }

    return (<Segment flexBasis={'Full'} segmentTitle={'Edit parameter'}>
        <form onSubmit={handleSubmit(onSubmit)} ref={scrollRef}>
            <FormTable>
                <tr>
                    <td><Input register={register} name={'path'} errors={errors} width={'450px'} /></td>
                    <td><Input register={register} name={'value'} errors={errors} /></td>
                    <td>
                        <FormControlBar>
                            <IconButton role={'save'} disabled={!isDirty} />
                            <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
                            <hr />
                            <IconButton role={'delete'} disabled={!watch('path')} size={'small'} deleteKeyword={'parameter'} onClick={() => onDelete()} />
                        </FormControlBar>
                    </td>
                </tr>
            </FormTable>
        </form>
    </Segment>);
}
