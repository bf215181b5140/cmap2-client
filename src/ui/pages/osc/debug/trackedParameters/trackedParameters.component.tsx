import React, { useEffect, useState } from 'react';
import Segment from '../../../../components/segment/segment.component';
import SegmentTable from '../../../../components/segment/segmentTable.component';
import { TrackedParameter } from '../../../../../electron/trackedParameters/trackedParameters.model';
import { theme } from 'cmap2-shared/react';

export default function TrackedParameters() {

  const [trackedParameters, setTrackedParameters] = useState<Map<string, TrackedParameter>>(new Map());
  const [bufferFrequencyLimit, setSufferFrequencyLimit] = useState<number | undefined>();

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
      console.log('trackedParameters:trackedParameter', data);
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

  function bufferedColor(trackedParameter: TrackedParameter) {
    if (trackedParameter.buffered) {
      return theme.colors.error;
    } else {
      return theme.colors.success;
    }
  }

  function bufferedIcon(trackedParameter: TrackedParameter) {
    if (trackedParameter.buffered) {
      return <i className={'ri-spam-3-fill'} />;
    } else {
      return <i className={'ri-shield-check-line'} />;
    }
  }

  return (<Segment width={'Full'} segmentTitle={'Parameters'}>
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
