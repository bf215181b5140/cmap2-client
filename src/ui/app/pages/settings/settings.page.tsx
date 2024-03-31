import { ContentBox, Content } from 'cmap2-shared/dist/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import FormTable from '../../shared/components/form/formTable.component';
import FormControlBar from '../../shared/components/form/formControlBar.component';
import SubmitInput from '../../shared/components/form/inputs/submit.component';
import NumberInput from '../../shared/components/form/inputs/number.component';
import Input from '../../shared/components/form/inputs/input.component';
import CheckboxInput from '../../shared/components/form/inputs/checkbox.component';
import { generalSettingsSchema, GeneralSettings } from '../../../../shared/types/settings';
import ButtonInput from '../../shared/components/form/inputs/button.component';

export default function SettingsPage() {

    const {register, reset, formState: {errors, isDirty}, handleSubmit, watch} = useForm<GeneralSettings>({resolver: zodResolver(generalSettingsSchema)});

    useEffect(() => {
        window.electronAPI.get('getGeneralSettings').then(settings => reset(settings, {keepDirty: false}));
    }, []);

    function onSubmit(formData: GeneralSettings) {
        window.electronAPI.send('setGeneralSettings', formData);
        reset(formData)
    }

    return (<Content flexDirection="column">
        <ContentBox>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Settings</h2>
                <FormTable>
                    <tr>
                        <th>Start minimized to tray</th>
                        <td><CheckboxInput register={register} name={'startMinimized'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Automatically check for updates</th>
                        <td><CheckboxInput register={register} name={'autoCheckUpdates'} errors={errors} /></td>
                        <td><ButtonInput text={'Check now'} onClick={() => window.electronAPI.send('checkForUpdate', true)} /></td>
                    </tr>
                    <tr>
                        <th>Check if Vrchat is running</th>
                        <td><CheckboxInput name={'enableVrcDetector'} register={register} errors={errors} /></td>
                        <th>every</th>
                        <td><NumberInput name={'vrcDetectorFrequency'} register={register} errors={errors} width={'60px'}
                                         readOnly={!watch('enableVrcDetector')} /></td>
                        <th>seconds</th>
                    </tr>
                </FormTable>
                <h2>OSC</h2>
                <FormTable>
                    <tr>
                        <th>VRChat lan IP</th>
                        <td><Input register={register} name={'oscIp'} placeholder={'127.0.0.1'} errors={errors} /></td>
                        <td>Default: 127.0.0.1</td>
                    </tr>
                    <tr>
                        <th>VRChat osc receiving port</th>
                        <td><NumberInput register={register} name={'oscInPort'} placeholder={'9000'} errors={errors} /></td>
                        <td>Default: 9000</td>
                    </tr>
                    <tr>
                        <th>VRChat osc sending port</th>
                        <td><NumberInput register={register} name={'oscOutPort'} placeholder={'9001'} errors={errors} /></td>
                        <td>Default: 9001</td>
                    </tr>
                </FormTable>
                <FormControlBar>
                    <SubmitInput disabled={!isDirty} />
                </FormControlBar>
            </form>
        </ContentBox>
    </Content>);
}
