import useCmapFetch from '../../../hooks/cmapFetch.hook';
import TypedEmitter from 'typed-emitter/rxjs';
import { ParametersPageEmitter } from '../types/parametersPageEmitter';
import React, { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../../../components/context/modal.context';
import useCmapUtil from '../../../hooks/cmapUtil.hook';
import { TrackedParametersMap, TrackedParametersSchema, VrcParameter } from 'cmap2-shared';
import Segment from '../../../components/segment/segment.component';
import AvatarName from '../../../components/savedAvatar/savedAvatar.component';
import FormControlBar from '../../../components/form/formControlBar.component';
import IconButton from '../../../components/buttons/iconButton.component';
import styled from 'styled-components';
import SegmentTable from '../../../components/segment/segmentTable.component';
import BasicModal from '../../../components/modal/basicModal/basicModal.component';

interface ParametersStateProps {
  parametersPageEmitter: TypedEmitter<ParametersPageEmitter>;
}

export default function TrackedParameters({ parametersPageEmitter }: ParametersStateProps) {

  const { GET, POST, DELETE } = useCmapFetch();
  const { setModal } = useContext(ModalContext);
  const { timeSinceTimestamp } = useCmapUtil();

  const [lastRefresh, setLastRefresh] = useState<number | undefined>();
  const [refreshId, setRefreshId] = useState(0);

  const [websiteParameters, setWebsiteParameters] = useState<TrackedParametersMap>(new TrackedParametersMap());
  const [localParameters, setLocalParameters] = useState<TrackedParametersMap>(new TrackedParametersMap());
  const allParameters = [...new Map([...websiteParameters, ...localParameters]).keys()];

  const avatarId = websiteParameters.get('/avatar/change');

  // refresh data if it's > 25s old
  if (lastRefresh && lastRefresh < (Date.now() - 25000)) refreshStateData();

  useEffect(() => {
    refreshStateData();

    const saveParameterListener = (parameter: VrcParameter) => {
      setWebsiteParameters(state => state.set(parameter.path, parameter.value));
      setLocalParameters(state => state.set(parameter.path, parameter.value));
    };
    parametersPageEmitter.on('saveParameter', saveParameterListener);

    const deleteParameterListener = (path: string) => {
      setWebsiteParameters(state => {
        state.delete(path);
        return state;
      });
      setLocalParameters(state => {
        state.delete(path);
        return state;
      });
    };
    parametersPageEmitter.on('deleteParameter', deleteParameterListener);

    const intervalId = setInterval(() => setRefreshId(state => state + 1), 1000);

    return () => {
      parametersPageEmitter.removeListener('saveParameter', saveParameterListener);
      parametersPageEmitter.removeListener('deleteParameter', deleteParameterListener);
      clearInterval(intervalId);
    };
  }, []);

  function refreshStateData() {
    GET('trackedParameters', TrackedParametersSchema, data => {
      setWebsiteParameters(new TrackedParametersMap(data));
      setLastRefresh(Date.now());
    });

    window.IPC.get('getTrackedParameters').then(data => {
      setLocalParameters(data);
      setLastRefresh(Date.now());
    });
  }

  function onSyncState() {
    setModal(<BasicModal title={'Uploading tracked parameters'} message={'This will upload and set website tracked parameters to currently detected ones from the program'}
                         confirmValue={'Upload'} confirmFunction={() => {
      const parameters = [...localParameters.entries()];
      POST('trackedParameters', parameters, undefined, () => {
        setWebsiteParameters(new TrackedParametersMap(parameters));
      });
    }} />);
  }

  function onClearState() {
    setModal(<BasicModal title={'Clearing tracked parameters'} message={'This will clear website tracked parameters'}
                         confirmValue={'Clear'} confirmFunction={() => {
      DELETE('trackedParameters', undefined, undefined, () => {
        setWebsiteParameters(new TrackedParametersMap());
      });
    }} />);
  }

  function localValueCell(key: string): React.JSX.Element {
    const localValue = localParameters.get(key);
    const className = localValue === websiteParameters.get(key) ? 'grey' : 'error';
    return <span className={className}>{localValue?.toString()}</span>;
  }

  return (<Segment segmentTitle={'Tracked parameters'} infoContent={segmentInfo}>

    <AvatarName avatarId={avatarId?.toString()} />

    <StateTableStyled>
      {allParameters.length > 0 ? (<>
        <thead>
        <tr>
          <th>Parameter</th>
          <th>Website value</th>
          <th>Program value</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {allParameters.map((parameter) => (
          <tr key={parameter} onClick={() => parametersPageEmitter.emit('selectParameter', { path: parameter, value: websiteParameters.get(parameter) || '' })}>
            <td>{parameter}</td>
            <td>{websiteParameters.get(parameter)?.toString()}</td>
            <td>{localValueCell(parameter)}</td>
            <td><i className={'ri-edit-line editIcon'} /></td>
          </tr>
        ))}
        </tbody>
      </>) : (
        <tbody>
        <tr>
          <td style={{ textAlign: 'center' }}>No tracked parameters yet :(</td>
        </tr>
        </tbody>
      )}
    </StateTableStyled>

    <FormControlBar>
      <span key={refreshId}>Last refresh: {timeSinceTimestamp(lastRefresh)}</span>
      <IconButton role={'normal'} tooltip={'Refresh'} icon={'ri-loop-left-line'} size={'small'} onClick={() => refreshStateData()} />
      <hr />
      <IconButton role={'normal'} tooltip={'Upload program parameters'} icon={'ri-upload-2-line'} onClick={() => onSyncState()} />
      <IconButton role={'normal'} tooltip={'Clear state'} icon={'ri-delete-bin-6-line'} onClick={() => onClearState()} />
    </FormControlBar>

  </Segment>);
}

const segmentInfo = <>
  <p>This is a list of all the parameters and their values that the website and this program are tracking for you.</p>
  <p>Parameters and values tracked on the website is how the website knows what to display and how layouts and buttons react to people coming to your website profile.</p>
  <p>
    If you keep the program running while you play VRChat this should be fairly accurate, however, there are many reason website parameters and values can become
    out of sync with this program or VRChat, so here are some options to help you control that. None of these actions have affect on your parameters in VRChat.
  </p>
  <ul>
    <li><b>Refresh</b>: refreshes the list</li>
    <li><b>Upload program state</b>: uploads parameters and their values from this program to the website</li>
    <li><b>Clear state</b>: clears all parameters from the website</li>
  </ul>
  <p>
    Additionally you can click on each parameter in the list to manually set the value or delete it.
  </p>
</>;

const StateTableStyled = styled(SegmentTable)`
  tbody {
    tr {
      cursor: pointer;

      td {
        &:first-child {
          border-bottom-left-radius: 5px;
          border-top-left-radius: 5px;
        }

        &:last-child {
          border-bottom-right-radius: 5px;
          border-top-right-radius: 5px;
        }

        &:not(:last-child) {
          padding-right: 15px;
        }
      }

      .editIcon {
        visibility: hidden;
      }

      :hover {
        background: ${props => props.theme.colors.ui.background3};

        .editIcon {
          visibility: visible;
        }
      }
    }

    span.error {
      color: ${props => props.theme.colors.error};
    }
  }

  @media (max-width: 1000px) {
    line-break: anywhere;
  }
`;

