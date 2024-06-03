import { useEffect, useState } from 'react';
import { VrcOscAvatar } from '../../../../../../shared/types/osc';
import ContentBox from '../../../../shared/components/contentBox/contentBox.component';
import { ContentBoxWidth } from 'cmap2-shared';
import styled from 'styled-components';
import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import ActionButton from '../../../../shared/components/buttons/actionButton.component';
import IconButton from '../../../../shared/components/buttons/iconButton.component';
import FormControlBar from '../../../../shared/components/form/formControlBar.component';

export default function WebsiteState() {

    const cmapFetch = useCmapFetch();

    const [parameters, setParameters] = useState<Map<string, string | number | boolean>>(new Map());
    const [avatarId, setAvatarId] = useState<string | undefined>();

    const [knownAvatars, setKnownAvatars] = useState<VrcOscAvatar[]>([]);

    useEffect(() => {
        window.electronAPI.get('getVrcOscAvatars').then(data => {
            setKnownAvatars(data);
        });

        getWebsiteState();
    }, []);

    function getWebsiteState() {
        cmapFetch('clientState', {
            method: 'GET'
        }, (data: { avatar: string, parameters: [string, (string | number | boolean)][] }) => { // todo types
            setParameters(new Map(data.parameters));
            setAvatarId(data.avatar);
        });
    }

    function syncWebsiteState() {
        window.electronAPI.get('getTrackedParameters').then(data => {
            const avatarId = data.get('/avatar/change');
            if (avatarId) data.delete('/avatar/change');

            const parameters = Array.from(data.entries());
            console.log(parameters);

            cmapFetch('clientState', {
                method: 'POST',
                body: JSON.stringify({ avatar: avatarId, parameters }), // todo proper type
                headers: { 'Content-Type': 'application/json' }
            }, (data: { avatar: string, parameters: [string, (string | number | boolean)][] }) => { // todo types
                setParameters(new Map(data.parameters));
                setAvatarId(data.avatar);
            });
        });
    }

    function clearWebsiteState() {
        cmapFetch('clientState', {
            method: 'DELETE'
        }, (data: { avatar: string, parameters: [string, (string | number | boolean)][] }) => { // todo types
            setParameters(new Map(data.parameters));
            setAvatarId(data.avatar);
        });
    }

    return (<ContentBox flexBasis={ContentBoxWidth.Full} contentTitle={'Website state'}>
        <p>This is currently known state of your OSC parameters as seen on the website. You can sync it with your local state or clear it.</p>

        <FormControlBar>
            <IconButton role={'normal'} tooltip={'Refresh'} icon={'ri-loop-left-line'} size={'small'} onClick={() => getWebsiteState()} />
            <hr />
            <IconButton role={'normal'} tooltip={'Download to local state'} icon={'ri-download-2-line'} onClick={() => syncWebsiteState()} />
            <IconButton role={'normal'} tooltip={'Upload local state to website'} icon={'ri-upload-2-line'} onClick={() => syncWebsiteState()} />
            <hr />
            <IconButton role={'delete'} tooltip={'Clear state'} size={'small'} deleteKeyword={'state'} onClick={() => clearWebsiteState()} />
        </FormControlBar>

        <AvatarNameStyled>
            <i className={'ri-contacts-book-fill'}></i>
            {/* {currentAvatarText()} */}
        </AvatarNameStyled>

        {parameters.size > 0 ? (
            <VrcOscStatusTableStyled>
                <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {Array.from(parameters).map((parameter) => (
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
