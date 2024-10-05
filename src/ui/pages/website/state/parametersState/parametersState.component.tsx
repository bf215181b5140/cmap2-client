import React, { useEffect, useState } from 'react';
import { ClientStateParameterFormDTO, ClientStateParametersSchema } from 'cmap2-shared';
import styled from 'styled-components';
import { EventEmitter } from 'events';
import Segment from '../../../../components/segment/segment.component';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import { VrcOscAvatar } from '../../../../../shared/objects/vrcOscAvatar';
import FormControlBar from '../../../../components/form/formControlBar.component';
import IconButton from '../../../../components/buttons/iconButton.component';

interface ParametersStateProps {
    statePageEmitter: EventEmitter;
}

export default function ParametersState({ statePageEmitter }: ParametersStateProps) {

    const { GET, POST, DELETE } = useCmapFetch();

    const [websiteParameters, setWebsiteParameters] = useState<Map<string, string | number | boolean>>(new Map());
    const [localParameters, setLocalParameters] = useState<Map<string, string | number | boolean>>(new Map());
    const allParameters = [...new Map([...websiteParameters, ...localParameters]).keys()];

    const [knownAvatars, setKnownAvatars] = useState<VrcOscAvatar[]>([]);
    const avatarId = websiteParameters.get('/avatar/change');
    const avatar = knownAvatars.find(a => a.id === avatarId);

    useEffect(() => {
        refreshStateData();

        window.IPC.get('getAvatars').then(data => {
            setKnownAvatars(data);
        });

        const setParameterListener = (parameter: ClientStateParameterFormDTO) => {
            setWebsiteParameters(state => new Map(state.set(parameter.path, parameter.value)));
            setLocalParameters(state => new Map(state.set(parameter.path, parameter.value)));
        };
        statePageEmitter.on('setParameter', setParameterListener);

        return () => {
            statePageEmitter.removeListener('setParameter', setParameterListener);
        }
    }, []);

    function refreshStateData() {
        GET('clientState', ClientStateParametersSchema, data => {
            setWebsiteParameters(new Map(data));
        });

        window.IPC.get('getTrackedParameters').then(data => {
            setLocalParameters(data);
        });
    }

    function syncLocalState() {
        const newLocalParameters = new Map([...localParameters, ...websiteParameters]);
        window.IPC.send('setTrackedParameters', newLocalParameters);
        setLocalParameters(newLocalParameters);
    }

    function syncWebsiteState() {
        const parameters = [...localParameters.entries()];
        POST('clientState', parameters, ClientStateParametersSchema, parameters => {
            setWebsiteParameters(new Map(parameters));
        });
    }

    function clearWebsiteState() {
        DELETE('clientState', undefined, ClientStateParametersSchema, parameters => {
            setWebsiteParameters(new Map(parameters));
        });
    }

    function deleteParameter() {
        // DELETE('clientState/parameter', deleteParameter, undefined, () => {
        //     statePageEmitter.emit('deleteParameter', deleteParameter);
        //     window.IPC.send('deleteTrackedParameter', deleteParameter);
        //     reset({
        //         path: '',
        //         value: ''
        //     });
        // });
    }

    function localValueCell(key: string): React.JSX.Element {
        const localValue = localParameters.get(key);
        const className = localValue === websiteParameters.get(key) ? 'grey' : 'error';
        return <span className={className}>{localValue?.toString()}</span>;
    }

    return (<Segment flexBasis={'Full'} segmentTitle={'Parameters state'} infoContent={segmentInfo}>

        <StateControlBarStyled>

            <AvatarNameStyled>
                {avatarId && <>
                    <i className={'ri-contacts-book-fill'} />
                    {avatar?.name || avatarId}
                </>}
            </AvatarNameStyled>

            <FormControlBar>
                <IconButton role={'normal'} tooltip={'Refresh'} icon={'ri-loop-left-line'} size={'small'} onClick={() => refreshStateData()} />
                <hr />
                <IconButton role={'normal'} tooltip={'Save to local state'} icon={'ri-download-2-line'} onClick={() => syncLocalState()} />
                <IconButton role={'normal'} tooltip={'Upload to website state'} icon={'ri-upload-2-line'} onClick={() => syncWebsiteState()} />
                <hr />
                <IconButton role={'delete'} tooltip={'Clear state'} size={'small'} deleteKeyword={'state'} onClick={() => clearWebsiteState()} />
            </FormControlBar>

        </StateControlBarStyled>

        <VrcOscStatusTableStyled>
            {allParameters.length > 0 ? (<>
                <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Value (on website)</th>
                    <th>Value (this program)</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {allParameters.map((parameter) => (
                    <tr key={parameter} onClick={() => statePageEmitter.emit('selectedParameter', parameter)}>
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
                    <td>No tracked parameters</td>
                </tr>
                </tbody>
            )}
        </VrcOscStatusTableStyled>
    </Segment>);
}

const segmentInfo = <>
    <p>This is a list of all the parameters and their values the website and this program are tracking for you.</p>
    <p>
        There are many reason website parameters state can become out of sync with this program or VRChat, so here are some options to help
        you control parameters
        state. None of these actions have affect on your parameters in VRChat.
        <ul>
            <li><b>Refresh</b>: refreshes the list</li>
            <li><b>Save to local state</b>: takes parameters from the website and saves them to this program</li>
            <li><b>Upload to website state</b>: takes parameters from this program and saves them to the website</li>
            <li><b>Clear state</b>: clears all parameters from the website</li>
        </ul>
    </p>
</>;

const StateControlBarStyled = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 7px;
`;

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
    padding: 10px 8px;

    thead th {
        padding: 0 12px 5px 12px;
        text-align: left;
        font-size: 18px;
        color: ${props => props.theme.colors.font.h2};
    }

    tbody {
        font-family: Noto-Sans-Regular, serif;

        tr {
            cursor: pointer;

            td {
                text-align: left;
                padding: 3px 8px;

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
    }

    span.error {
        color: ${props => props.theme.colors.error};
    }
`;

