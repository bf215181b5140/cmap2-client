import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { VrcOscAvatar } from '../../../../../shared/objects/vrcOscAvatar';
import Segment from '../../../../components/segment/segment.component';
import SegmentTable from '../../../../components/segment/segmentTable.component';
import AvatarName from '../../../../components/savedAvatar/savedAvatar.component';

export default function OscStatus() {

    const [trackedParameters, setTrackedParametersState] = useState<Map<string, string | number | boolean>>(new Map());
    const trackedAvatarId = trackedParameters.get('/avatar/change')?.toString();

    useEffect(() => {
        window.IPC.get('getTrackedParameters').then(data => setTrackedParametersState(data));

        const removeListener = window.IPC.receive('vrcParameter', vrcParameter => setTrackedParametersState(state => state.set(vrcParameter.path, vrcParameter.value)));

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

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
    </Segment>);
}

const AvatarNameStyled = styled.h4`
    font-size: 18px;
    margin: 0 0 15px 10px;
    font-weight: normal;

    i {
        font-size: 24px;
        margin-right: 7px;
    }
`;