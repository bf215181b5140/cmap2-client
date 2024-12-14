import React, { useEffect, useRef, useState } from 'react';
import Segment from '../../../components/segment/segment.component';
import SegmentTable from '../../../components/segment/segmentTable.component';
import AvatarName from '../../../components/savedAvatar/savedAvatar.component';
import { useForm } from 'react-hook-form';
import { TrackedParametersSettings, TrackedParametersSettingsSchema } from '../../../../shared/objects/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../components/form/formTable.component';
import CheckboxInput from '../../../components/input/checkbox.component';
import { TrackedParametersMap } from 'cmap2-shared';

export default function TrackedParameters() {

  const [trackedParameters, setTrackedParameters] = useState<TrackedParametersMap>(new TrackedParametersMap());
  const trackedAvatarId = trackedParameters.get('/avatar/change')?.toString();

  const { register, formState: { errors }, handleSubmit, reset } = useForm<TrackedParametersSettings>({ resolver: zodResolver(TrackedParametersSettingsSchema) });
  const submitRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.IPC.get('getTrackedParameters').then(data => setTrackedParameters(data));
    window.IPC.get('getTrackedParametersSettings').then(data => reset(data));

    const parameterListener = window.IPC.receive('vrcParameter', vrcParameter => setTrackedParameters(state => new TrackedParametersMap(state.set(vrcParameter.path, vrcParameter.value))));
    const parametersListener = window.IPC.receive('trackedParameters', data => setTrackedParameters(new TrackedParametersMap(data)));

    return () => {
      if (parameterListener) parameterListener();
      if (parametersListener) parametersListener();
    };
  }, []);

  function onSubmit(data: TrackedParametersSettings) {
    window.IPC.send('saveTrackedParametersSettings', data);
  }

  return (<Segment segmentTitle={'Tracked parameters'}>

    <AvatarName avatarId={trackedAvatarId} />

    <SegmentTable>
      <thead>
      <tr>
        <th>Parameter</th>
        <th>Value</th>
      </tr>
      </thead>
      <tbody>
      {trackedParameters.size === 0 && <tr>
        <td colSpan={2} style={{ textAlign: 'center' }}>No detected parameters yet</td>
      </tr>}
      {Array.from(trackedParameters).map((parameter) => (
        <tr key={parameter[0]}>
          <td>{parameter[0]}</td>
          <td>{parameter[1].toString()}</td>
        </tr>
      ))}
      </tbody>
    </SegmentTable>

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
