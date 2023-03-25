import ContentBox from '../components/contentBox.component';
import FormInput from '../components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Content from '../components/content.component';

export default function SettingsPage() {

    const {register, setValue, formState: {errors}, handleSubmit} = useForm({
        resolver: zodResolver(
            z.object({
                startMinimized: z.boolean()
            })
        )
    });

    useEffect(() => {
        window.electronAPI.getApplicationSettings().then(applicationSettings => {
            if (applicationSettings) {
                setValue('startMinimized', applicationSettings.startMinimized);
            }
        });
    }, []);

    function onSubmit(formData: any) {
        window.electronAPI.setApplicationSettings(formData);
    }

    return (<Content>
        <ContentBox>
            <h2>Settings</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <table>
                    <tbody>
                    <tr>
                        <th>Start minimized to tray</th>
                        <td><FormInput type={InputType.Boolean} register={register} name={'startMinimized'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <td colSpan={2}><FormInput type={InputType.Submit} /></td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </ContentBox>
    </Content>);
}
