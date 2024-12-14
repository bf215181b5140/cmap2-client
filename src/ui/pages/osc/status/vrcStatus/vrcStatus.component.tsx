import { useEffect } from 'react';
import useVrcDetector from '../../../../hooks/vrcDetector.hook';
import Segment from '../../../../components/segment/segment.component';
import FormTable from '../../../../components/form/formTable.component';
import { useForm } from 'react-hook-form';
import { VrcDetectorSettings, VrcDetectorSettingsSchema } from '../../../../../shared/objects/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import CheckboxInput from '../../../../components/input/checkbox.component';
import FormControlBar from '../../../../components/form/formControlBar.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import NumberInput from '../../../../components/input/number.component';
import { settingsStoreDefaults } from '../../../../../electron/store/settings/settings.model';

export default function VrcStatus() {

  const { vrcStatus, vrcStatusColor, icon } = useVrcDetector();
  const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm<VrcDetectorSettings>({
    resolver: zodResolver(VrcDetectorSettingsSchema),
    defaultValues: settingsStoreDefaults.vrcDetector
  });

  useEffect(() => {
    window.IPC.get('getVrcDetectorSettings').then(data => reset(data));
  }, []);

  function onSubmit(formData: VrcDetectorSettings) {
    window.IPC.send('saveVrcDetectorSettings', formData);
    reset(formData);
  }

  return (<Segment segmentTitle={'VRChat'}>
    <div style={{ color: vrcStatusColor, marginBottom: '15px' }}>
      <i className={icon} style={{ paddingRight: '5px', fontSize: '20px' }} />
      {vrcStatus}
    </div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTable visible={true}>
        <tr>
          <td style={{ width: '110px' }}>Detect VRChat</td>
          <td style={{ width: '80px' }}>
            <CheckboxInput name={'detect'} register={register} errors={errors} />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>Frequency</td>
          <td>
            <NumberInput name={'frequency'} register={register} errors={errors} width={'75px'} />
          </td>
          <td>seconds</td>
          <td>
            <FormControlBar style={{ margin: '0' }}>
              <IconButton role={'save'} disabled={!isDirty} />
              <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
          </td>
        </tr>
      </FormTable>
    </form>
  </Segment>);
}


