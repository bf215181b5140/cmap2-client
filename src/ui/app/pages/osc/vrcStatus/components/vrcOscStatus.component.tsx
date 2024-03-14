import { ContentBox } from 'cmap2-shared/dist/react';
import { useEffect, useState } from 'react';
import { ContentBoxWidth } from 'cmap2-shared';
import { VrcOscAvatar } from '../../../../../../shared/types/osc';
import styled from 'styled-components';

export default function VrcOscStatus() {

    const [trackedParameters, setTrackedParametersState] = useState<Map<string, string | number | boolean>>(new Map());
    const [trackedAvatarId, setTrackedAvatarId] = useState<string | undefined>();
    const [knownAvatars, setKnownAvatars] = useState<VrcOscAvatar[]>([]);
    const [activeAvatar, setActiveAvatar] = useState<VrcOscAvatar | undefined>(undefined);

    useEffect(() => {
        window.electronAPI.get('getTrackedParameters').then(data => {
            setTrackedParametersState(data);
            const avatarId = data.get('/avatar/change');
            if (avatarId) setTrackedAvatarId(avatarId.toString());
        });

        window.electronAPI.get('getVrcOscAvatars').then(data => {
            setKnownAvatars(data);
        });

        const removeListener = window.electronAPI.receive('vrcParameter', (vrcParameter) => {
            setTrackedParametersState((state) => state.set(vrcParameter.path, vrcParameter.value));
            if (vrcParameter.path === '/avatar/change') {
                setTrackedAvatarId(vrcParameter.value.toString());
            }
        });

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    useEffect(() => {
        if (trackedAvatarId === undefined) return;
        if (knownAvatars.length === 0) return;

        setActiveAvatar(knownAvatars.find(avatar => avatar.id === trackedAvatarId));
    }, [knownAvatars, trackedAvatarId]);

    function currentAvatarText() {
        if (trackedAvatarId === undefined) return 'No avatar detected';
        if (activeAvatar) return activeAvatar.name;
        return `Unknown avatar with ID ${trackedAvatarId}`;
    }

    return (<ContentBox flexBasis={ContentBoxWidth.Full} title={'Current detected avatar state'}>
        <AvatarNameStyled>
            <i className={'ri-contacts-book-fill'}></i>
            {currentAvatarText()}
        </AvatarNameStyled>

        {trackedParameters.size > 0 ? (
            <VrcOscStatusTableStyled>
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
            </VrcOscStatusTableStyled>
        ) : (
            <p>No tracked parameters</p>
        )}
    </ContentBox>);
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

const VrcOscStatusTableStyled = styled.table`
  display: block;
  border-collapse: collapse;
  background: ${props => props.theme.colors.ui.background5};
  border-radius: 8px;
  padding: 10px 15px;

  thead th {
    padding: 0 15px 6px 10px;
    text-align: left;
    font-size: 18px;
    color: ${props => props.theme.colors.font.h2};
  }

  tbody {
    font-family: Noto-Sans-Regular, serif;

    td {
      text-align: left;
      padding: 3px 15px 3px 0;
    }
  }
`;
