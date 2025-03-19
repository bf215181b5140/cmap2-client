import React, { useEffect, useState } from 'react';
import Segment from '../../../../components/segment/segment.component';
import SegmentTable from '../../../../components/segment/segmentTable.component';
import { TrackedParameter } from '../../../../../electron/trackedParameters/trackedParameters.model';
import { theme } from 'cmap-shared/react';
import AvatarName from '../../../../components/savedAvatar/savedAvatar.component';

export default function TrackedParameters() {

  const [trackedParameters, setTrackedParameters] = useState<Map<string, TrackedParameter>>(new Map());
  const [bufferFrequencyLimit, setSufferFrequencyLimit] = useState<number | undefined>();
  const trackedAvatarId = trackedParameters.get('/avatar/change')?.value?.toString();

  useEffect(() => {
    function getTrackedParameters() {
      window.IPC.get('trackedParameters:getTrackedParameters').then(data => {
        setTrackedParameters(new Map(data));
      });
    }

    getTrackedParameters();

    window.IPC.get('trackedParameters:getBufferFrequencyLimit').then(data => {
      setSufferFrequencyLimit(data);
    });

    const intervalId = setInterval(getTrackedParameters, 1500);

    const removeListener = window.IPC.receive('trackedParameters:trackedParameter', (data) => {
      setTrackedParameters(state => new Map(state.set(data[0], data[1])));
    });

    return () => {
      clearInterval(intervalId);
      if (removeListener) removeListener();
    };
  }, []);

  function frequencyColor(trackedParameter: TrackedParameter) {
    if (!bufferFrequencyLimit) return undefined;
    if (trackedParameter.frequency / bufferFrequencyLimit < 0.3) return theme.colors.success;
    if (trackedParameter.frequency / bufferFrequencyLimit < 0.7) return theme.colors.warning;
    return theme.colors.error;
  }

  function frequencyText(trackedParameter: TrackedParameter) {
    if (!bufferFrequencyLimit) return trackedParameter.frequency.toString();
    if (trackedParameter.frequency / bufferFrequencyLimit < 0.3) return 'Low';
    if (trackedParameter.frequency / bufferFrequencyLimit < 0.7) return 'Medium';
    return 'High';
  }

  return (<Segment width={'Full'} segmentTitle={'Parameters'} infoContent={segmentInfo}>

    <AvatarName avatarId={trackedAvatarId} />

    <SegmentTable>
      <thead>
      <tr>
        <th>Path</th>
        <th>Value</th>
        <th style={{ width: '120px', textAlign: 'center' }}>Last message</th>
        <th style={{ width: '100px', textAlign: 'center' }}>Frequency</th>
        <th style={{ width: '100px', textAlign: 'center' }}>Buffering</th>
      </tr>
      </thead>
      <tbody>
      {trackedParameters.size === 0 && <tr>
        <td colSpan={5} style={{ textAlign: 'center' }}>Waiting for OSC activity...</td>
      </tr>}
      {[...trackedParameters.entries()].map(([path, trackedParameter]) => (
        <tr key={path}>
          <td>{path}</td>
          <td>{trackedParameter.value.toString()}</td>
          <td style={{ textAlign: 'center' }}>{new Date(trackedParameter.lastActivity).toLocaleTimeString()}</td>
          <td style={{ textAlign: 'center' }}><span style={{ color: frequencyColor(trackedParameter) }}>{frequencyText(trackedParameter)}</span></td>
          <td style={{ textAlign: 'center' }}>
            <span style={{ color: trackedParameter.buffered ? theme.colors.error : theme.colors.success }}>
              {trackedParameter.buffered ? 'Yes' : 'No'}
            </span>
          </td>
        </tr>
      ))}
      </tbody>
    </SegmentTable>
  </Segment>);
}

const segmentInfo = <>
  <p>
    <b>Frequncy</b> means how often a parameter is detected, if one parameter is being sent out too often (many times each second) it will start buffering.
    <br />
    <b>Buffering</b> means that the parameter wont be forwarded to the website right away, but will instead be sent out every ~1 second.
  </p>
</>;