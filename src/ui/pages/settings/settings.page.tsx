import { ContentBox, Content } from 'cmap2-shared/dist/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import FormTable from '../../shared/components/form/formTable.component';
import FormControlBar from '../../shared/components/form/formControlBar.component';
import SubmitInput from '../../shared/components/form/inputs/submit.component';
import NumberInput from '../../shared/components/form/inputs/number.component';
import Input from '../../shared/components/form/inputs/input.component';
import CheckboxInput from '../../shared/components/form/inputs/checkbox.component';

export default function SettingsPage() {

    const {register, reset, formState: {errors}, handleSubmit, watch} = useForm({
        resolver: zodResolver(
            z.object({
                startMinimized: z.boolean(),
                autoLogin: z.boolean(),
                enableVrcDetector: z.boolean(),
                vrcDetectorFrequency: z.number().min(1).max(3600),
                oscIp: z.string().optional(),
                oscInPort: z.number().optional(),
                oscOutPort: z.number().optional(),
            })
        )
    });

    useEffect(() => {
        window.electronAPI.get('getApplicationSettings').then(applicationSettings => {
            if (applicationSettings) {
                reset(applicationSettings);
            }
        });
    }, []);

    function onSubmit(formData: any) {
        if (formData.oscIp === '') formData.oscIp = undefined;
        window.electronAPI.send('setApplicationSettings', formData);
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
                        <th>Connect automatically</th>
                        <td><CheckboxInput register={register} name={'autoLogin'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Check if Vrchat is running</th>
                        <td><CheckboxInput name={'enableVrcDetector'} register={register} errors={errors} /></td>
                        <th>every</th>
                        <td><NumberInput name={'vrcDetectorFrequency'} register={register} errors={errors} width={'60px'} readOnly={!watch('enableVrcDetector')}/></td>
                        <th>seconds</th>
                    </tr>
                </FormTable>
                <h2>OSC settings</h2>
                <FormTable>
                    <tr>
                        <th>VRChat lan IP</th>
                        <td><Input register={register} name={'oscIp'} placeholder={'127.0.0.1'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>VRChat osc receiving port</th>
                        <td><NumberInput register={register} name={'oscInPort'} placeholder={'9000'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>VRChat osc sending port</th>
                        <td><NumberInput register={register} name={'oscOutPort'} placeholder={'9001'} errors={errors} /></td>
                    </tr>
                </FormTable>
                <FormControlBar>
                    <SubmitInput />
                </FormControlBar>
            </form>
        </ContentBox>
    </Content>);
}
