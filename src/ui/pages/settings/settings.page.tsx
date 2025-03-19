import React, { useEffect } from 'react';
import { Page } from '../../components/page/page.component';
import Segment from '../../components/segment/segment.component';
import FormTable from '../../components/form/formTable.component';
import { useForm } from 'react-hook-form';
import { AppSettings, AppSettingsSchema } from '../../../shared/objects/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import CheckboxInput from '../../components/input/checkbox.component';
import FormControlBar from '../../components/form/formControlBar.component';
import IconButton from '../../components/buttons/iconButton.component';

export default function SettingsPage() {

  const { register, setValue, formState: { errors, isDirty }, handleSubmit, reset } = useForm<AppSettings>({
    resolver: zodResolver(AppSettingsSchema),
    defaultValues: window.IPC.store.getSync('app')
  });

  // Keep hidden value for window size in sync
  useEffect(() => {
    const windowSizeListener = window.IPC.receive('window:size', size => setValue('windowSize', size, { shouldDirty: false }));

    return () => {
      windowSizeListener();
    };
  }, []);

  function onSubmit(formData: AppSettings) {
    window.IPC.store.set('app', formData);
    reset(formData);
  }

  return (<Page flexDirection={'column'}>
    <Segment segmentTitle={'Settings'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTable visible={true}>
          <tr>
            <td style={{ width: '160px' }}>Start on PC boot</td>
            <td><CheckboxInput register={register} name={'startOnBoot'} errors={errors} /></td>
            <td></td>
          </tr>
          <tr>
            <td>Start minimized to tray</td>
            <td><CheckboxInput register={register} name={'startInBackground'} errors={errors} /></td>
            <td>
              <FormControlBar margin={'0'}>
                <IconButton role={'save'} disabled={!isDirty} />
                <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
              </FormControlBar>
            </td>
          </tr>
        </FormTable>
      </form>
    </Segment>
  </Page>);
}
