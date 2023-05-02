import ContentBox from '../../shared/components/contentBox.component';
import FormInput from '../../shared/components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Content from '../../shared/components/content.component';
import { FormTable, FormControl } from '../../shared/components/form/formTable.component';
import { ApplicationSettings } from '../../../shared/classes';

export default function SettingsPage() {

    const {register, reset, watch, formState: {errors}, handleSubmit} = useForm({
        resolver: zodResolver(
            z.object({
                startMinimized: z.boolean(),
                autoLogin: z.boolean(),
                oscIp: z.string().optional(),
                oscInPort: z.number().optional(),
                oscOutPort: z.number().optional(),
            })
        )
    });

    const test = watch('startMinimized')
    console.log('watcg', test)

    useEffect(() => {
        window.electronAPI.getApplicationSettings().then(applicationSettings => {
            if (applicationSettings) {
                reset(applicationSettings);
            }
        });
    }, []);

    function onSubmit(formData: any) {
        if (formData.oscIp === '') formData.oscIp = undefined;
        window.electronAPI.setApplicationSettings(formData);
    }

    return (<Content>
        <ContentBox>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Settings</h2>
                <FormTable>
                    <tr>
                        <th>Start minimized to tray</th>
                        <td><FormInput type={InputType.Boolean} register={register} name={'startMinimized'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Connect automatically</th>
                        <td><FormInput type={InputType.Boolean} register={register} name={'autoLogin'} errors={errors} /></td>
                    </tr>
                </FormTable>
                <h2>OSC settings</h2>
                <FormTable>
                    <tr>
                        <th>VRChat lan IP</th>
                        <td><FormInput type={InputType.Text} register={register} name={'oscIp'} placeholder={'127.0.0.1'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>VRChat osc receiving port</th>
                        <td><FormInput type={InputType.Number} register={register} name={'oscInPort'} placeholder={'9000'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>VRChat osc sending port</th>
                        <td><FormInput type={InputType.Number} register={register} name={'oscOutPort'} placeholder={'9001'} errors={errors} /></td>
                    </tr>
                </FormTable>
                <FormControl>
                    <FormInput type={InputType.Submit} />
                </FormControl>
            </form>
        </ContentBox>
    </Content>);
}