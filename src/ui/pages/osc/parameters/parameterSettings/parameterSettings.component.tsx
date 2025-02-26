import React, { useEffect, useRef, useState } from 'react';
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
  const submitRef = useRef<HTMLInputElement>(null);
  // @ts-ignore
  const { fields, append, remove } = useFieldArray({ control, name: 'blacklist' });

  useEffect(() => {
    window.IPC.get('trackedParameters:getIgnoredParameters').then(data => setIgnoredParameters(data));
    window.IPC.store.get('trackedParameters').then(data => reset(data));
  }, []);

  function onSubmit(data: TrackedParametersSettings) {
    window.IPC.store.set('trackedParameters', data);
    reset(data);
  }

  return (<Segment width={'Full'} segmentTitle={'Settings'}>
    <Form onSubmit={handleSubmit(onSubmit)} visible={true}>
      <FormTable>
        <tr>
          <th style={{ width: '270px' }}>Clear old parameters on avatar change</th>
          <td><CheckboxInput name={'clearOnAvatarChange'} register={register} errors={errors} /></td>
        </tr>
      </FormTable>
      <fieldset>
        <legend>Blacklist</legend>
        <p>Specify parameters that you don't want to track and forward to the website.</p>
        <p>
          Some parameters are already automatically ignored because they are sent 100+ times a second during normal gameplay.
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
