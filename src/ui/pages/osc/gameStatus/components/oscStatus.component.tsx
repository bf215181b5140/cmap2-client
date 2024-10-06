import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { VrcOscAvatar } from '../../../../../shared/objects/vrcOscAvatar';
import Segment from '../../../../components/segment/segment.component';
import SegmentTable from '../../../../components/segment/segmentTable.component';
import AvatarName from '../../../../components/savedAvatar/savedAvatar.component';
import { useForm } from 'react-hook-form';
import { OscStateSettings, OscStateSettingsSchema, SocketSettings, SocketSettingsSchema } from '../../../../../shared/objects/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../components/form/formTable.component';
import CheckboxInput from '../../../../components/input/checkbox.component';

export default function OscStatus() {

    const [trackedParameters, setTrackedParametersState] = useState<Map<string, string | number | boolean>>(new Map());
    const trackedAvatarId = trackedParameters.get('/avatar/change')?.toString();

    const { register, formState: { errors }, handleSubmit, reset } = useForm<OscStateSettings>({ resolver: zodResolver(OscStateSettingsSchema) });
    const submitRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        window.IPC.get('getTrackedParameters').then(data => setTrackedParametersState(data));
        window.IPC.get('getOscStateSettings').then(data => reset(data));

        const removeListener = window.IPC.receive('vrcParameter', vrcParameter => setTrackedParametersState(state => state.set(vrcParameter.path, vrcParameter.value)));

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    function onSubmit(data: OscStateSettings) {
        window.IPC.send('saveOscStateSettings', data);
    }


    return (<Segment flexBasis={'Full'} segmentTitle={'Current detected avatar state'}>

        <AvatarName avatarId={trackedAvatarId} />

        {trackedParameters.size > 0 ? (
            <SegmentTable>
                <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {Array.from(trackedParameters).map((parameter) => (
                    <tr key={parameter[0]}>
                        <td>{parameter[0]}</td>
                        <td>{parameter[1].toString()}</td>
                    </tr>
                ))}
                </tbody>
            </SegmentTable>
        ) : (
            <p>No detected parameters</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
            <FormTable>
                <tr>
                    <th>Clear old parameters on avatar change</th>
                    <td><CheckboxInput name={'clearOnAvatarChange'} register={register} errors={errors} onChange={() => submitRef.current?.click()} /></td>
                </tr>
            </FormTable>
            <input type={'submit'} ref={submitRef} style={{ display: 'none' }} />
        </form>

    </Segment>);
}
