import React, { useEffect, useState } from 'react';
import Segment from '../../../../components/segment/segment.component';
import { TrackedParametersSettings, TrackedParametersSettingsSchema } from '../../../../../shared/objects/settings';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../components/form/formTable.component';
import CheckboxInput from '../../../../components/input/checkbox.component';
import FormRemoveRow from '../../../../components/form/removeRow/formRemoveRow.component';
import Form from '../../../../components/form/form.component';
import FormAddRow from '../../../../components/form/addRow/formAddRow.component';
import ParameterInput from '../../../../components/input/parameterInput/parameterInput.component';
import FormControlBar from '../../../../components/form/formControlBar.component';
import IconButton from '../../../../components/buttons/iconButton.component';

export default function ParameterSettings() {

  const [ignoredParameters, setIgnoredParameters] = useState<string[]>([]);
  const [showIgnoredParameters, setShowIgnoredParameters] = useState<boolean>(false);

  const { register, formState: { errors, isDirty }, handleSubmit, reset, control, setValue } = useForm<TrackedParametersSettings>({ resolver: zodResolver(TrackedParametersSettingsSchema) });
  // @ts-ignore
  const { fields, append, remove } = useFieldArray({ control, name: 'blacklist' });

  useEffect(() => {
    window.IPC.get('trackedParameters:getIgnoredParameters').then(data => setIgnoredParameters(data));
    window.IPC.store.get('trackedParameters').then(data => reset(data));

    const settingsListener = window.IPC.receive('store:trackedParametersSettings', (data) => reset(data));

    return () => {
      if (settingsListener) settingsListener();
    };
  }, []);

  function onSubmit(data: TrackedParametersSettings) {
    window.IPC.store.set('trackedParameters', data);
    reset(data);
  }

  return (<Segment width={'Full'} segmentTitle={'Settings'}>
    <Form onSubmit={handleSubmit(onSubmit)} visible={true}>
      <FormTable>
        <tr>
          <th style={{ width: '160px' }}>Clear on avatar change</th>
          <td style={{ width: '55px' }}><CheckboxInput name={'clearOnAvatarChange'} register={register} errors={errors} /></td>
          <td><p>Will clear old parameters after changing avatar (not always 100% accurate)</p></td>
        </tr>
        <tr>
          <th>Save parameters</th>
          <td><CheckboxInput name={'saveParameters'} register={register} errors={errors} /></td>
          <td><p>Will try save parameters on exit for next time you launch the application</p></td>
        </tr>
      </FormTable>
      <fieldset>
        <legend>Blacklist</legend>
        <p>Specify parameters that you don't want to track and forward to the website.</p>
        <p>
          Some parameters are already automatically ignored because they are sent too many times a second during normal gameplay.
          <br />
          <span className={'clickable'} onClick={() => setShowIgnoredParameters(!showIgnoredParameters)}>
            Click to show the full list <i className={showIgnoredParameters ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
          </span>
        </p>
        {showIgnoredParameters && <ul>
          {ignoredParameters.map(ip => (<li key={ip}>{ip}</li>))}
        </ul>}
        <FormTable>
          {fields.map((item, index) => (
            <tr key={index}>
              <td>
                <ParameterInput register={register} name={`blacklist.${index}`} setValue={setValue} errors={errors} />
              </td>
              <FormRemoveRow onClick={() => remove(index)} />
            </tr>
          ))}
          <tr>
            <FormAddRow colSpan={1} items={fields.length} onClick={() => append('')} />
          </tr>
        </FormTable>
      </fieldset>
      <FormControlBar>
        <IconButton role={'save'} disabled={!isDirty} />
        <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
      </FormControlBar>
    </Form>
  </Segment>);
}
