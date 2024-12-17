import { useEffect } from 'react';
import Segment from '../../../../components/segment/segment.component';
import { useForm } from 'react-hook-form';
import { OscSettings, OscSettingsSchema } from '../../../../../shared/objects/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../components/form/formTable.component';
import NumberInput from '../../../../components/input/number.component';
import FormControlBar from '../../../../components/form/formControlBar.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import useOscActivity from '../../../../hooks/oscActivity.hook';
import Input from '../../../../components/input/input.component';
import { settingsStoreDefaults } from '../../../../../electron/store/settings/settings.model';

export default function OscStatus() {

  const { oscActivityText, oscActivityColor } = useOscActivity();
  const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm<OscSettings>({
    resolver: zodResolver(OscSettingsSchema),
    defaultValues: window.IPC.store.getSync('osc')
  });

  function onSubmit(formData: OscSettings) {
    window.IPC.store.set('osc', formData);
    reset(formData);
  }

  return (<Segment segmentTitle={'OSC'}>
    <div style={{ color: oscActivityColor, marginBottom: '15px' }}>
      {/* <i className={icon} style={{ paddingRight: '5px', fontSize: '20px' }} /> */}
      {oscActivityText}
    </div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTable visible={true}>
        <tr>
          <td style={{ width: '130px' }}>VRChat IP</td>
          <td style={{ width: '110px' }}><Input register={register} name={'ip'} placeholder={'127.0.0.1'} width={'100px'} errors={errors} /></td>
          <td colSpan={2}><p>Default: 127.0.0.1 - Leave on default if you play VRChat on the same PC, otherwise set the IP of the PC that runs VRChat</p></td>
        </tr>
        <tr>
          <th>Recieving on port</th>
          <td><NumberInput register={register} name={'outPort'} placeholder={'9001'} width={'100px'} errors={errors} /></td>
          <td colSpan={2}><p>Default: 9001</p></td>
        </tr>
        <tr>
          <th>Sending on port</th>
          <td><NumberInput register={register} name={'inPort'} placeholder={'9000'} width={'100px'} errors={errors} /></td>
          <td><p>Default: 9000</p></td>
          <td>
            <FormControlBar margin={'0'}>
              <IconButton role={'save'} disabled={!isDirty} />
              <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
          </td>
        </tr>
      </FormTable>
    </form>
  </Segment>);
}
