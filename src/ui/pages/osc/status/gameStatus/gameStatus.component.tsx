import useGameDetector from '../../../../hooks/gameDetector.hook';
import Segment from '../../../../components/segment/segment.component';
import FormTable from '../../../../components/form/formTable.component';
import { useForm } from 'react-hook-form';
import { GameDetectorSettings, GameDetectorSettingsSchema } from '../../../../../shared/objects/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import CheckboxInput from '../../../../components/input/checkbox.component';
import FormControlBar from '../../../../components/form/formControlBar.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import NumberInput from '../../../../components/input/number.component';

export default function GameStatus() {

  const { gamesDetectedText, gamesDetectedColor, gameDetectionIcon } = useGameDetector();
  const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm<GameDetectorSettings>({
    resolver: zodResolver(GameDetectorSettingsSchema),
    defaultValues: window.IPC.store.getSync('gameDetector')
  });

  function onSubmit(formData: GameDetectorSettings) {
    window.IPC.store.set('gameDetector', formData);
    reset(formData);
  }

  return (<Segment segmentTitle={'Games'}>
    <div style={{ color: gamesDetectedColor, marginBottom: '15px' }}>
      <i className={gameDetectionIcon} style={{ paddingRight: '5px', fontSize: '20px' }} />
      {gamesDetectedText}
    </div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTable visible={true}>
        <tr>
          <td style={{ width: '130px' }}>Detect VRChat</td>
          <td style={{ width: '80px' }}>
            <CheckboxInput name={'detectVRChat'} register={register} errors={errors} />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>Detect ChilloutVR</td>
          <td>
            <CheckboxInput name={'detectChilloutVR'} register={register} errors={errors} />
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


