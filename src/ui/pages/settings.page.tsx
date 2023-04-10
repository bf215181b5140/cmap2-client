import ContentBox from '../components/contentBox.component';
import FormInput from '../components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Content from '../components/content.component';
import { FormTable, FormControl } from '../components/form/formTable.component';

export default function SettingsPage() {

    const {register, setValue, formState: {errors}, handleSubmit} = useForm({
        resolver: zodResolver(
            z.object({
                startMinimized: z.boolean(),
                autoLogin: z.boolean()
            })
        )
    });

    useEffect(() => {
        window.electronAPI.getApplicationSettings().then(applicationSettings => {
            if (applicationSettings) {
                setValue('startMinimized', applicationSettings.startMinimized);
                setValue('autoLogin', applicationSettings.autoLogin);
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
                <FormControl>
                    <FormInput type={InputType.Submit} />
                </FormControl>
            </form>
        </ContentBox>
    </Content>);
}
