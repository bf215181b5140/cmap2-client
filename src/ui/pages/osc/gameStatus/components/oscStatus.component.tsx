import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { VrcOscAvatar } from '../../../../../shared/schemas/avatars.schema';
import Segment from '../../../../components/segment/segment.component';
import { SegmentWidth } from 'cmap2-shared';
import SegmentTable from '../../../../components/segment/segmentTable.component';

export default function OscStatus() {

    const [trackedParameters, setTrackedParametersState] = useState<Map<string, string | number | boolean>>(new Map());
    const [knownAvatars, setKnownAvatars] = useState<VrcOscAvatar[]>([]);

    const trackedAvatarId = trackedParameters.get('/avatar/change')?.toString();
    const activeAvatar = knownAvatars.find(a => a.id === trackedAvatarId);

    useEffect(() => {
        window.IPC.get('getTrackedParameters').then(data => setTrackedParametersState(data));

        window.IPC.get('getAvatars').then(data => setKnownAvatars(data));

        const removeListener = window.IPC.receive('vrcParameter', vrcParameter => setTrackedParametersState(state => state.set(vrcParameter.path, vrcParameter.value)));

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    function currentAvatarText() {
        if (trackedAvatarId === undefined) return 'No avatar detected';
        if (activeAvatar) return activeAvatar.name;
        return `Unknown avatar with ID ${trackedAvatarId}`;
    }

    return (<Segment flexBasis={SegmentWidth.Full} segmentTitle={'Current detected avatar state'}>
        <AvatarNameStyled>
            <i className={'ri-contacts-book-fill'}></i>
            {currentAvatarText()}
        </AvatarNameStyled>

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