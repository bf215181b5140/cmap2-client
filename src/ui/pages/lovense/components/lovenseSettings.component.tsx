import { ContentBox } from 'cmap2-shared/dist/react';
import { LovenseSettingsSchema, LovenseSettings } from '../../../../shared/lovense';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import React, { useEffect } from 'react';
import FormTable from '../../../shared/components/form/formTable.component';
import FormInput from '../../../shared/components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import FormControlBar from '../../../shared/components/form/formControlBar.component';

export default function Settings() {
    const {register, reset, watch, formState: {errors, isDirty}, handleSubmit} = useForm<LovenseSettings>({resolver: zodResolver(LovenseSettingsSchema)});
    const formWatch = watch();

    useEffect(() => {
        window.electronAPI.get('getLovenseSettings').then(lovenseSettings => reset(lovenseSettings, {keepDirty: false}));
    }, []);

    function onSubmit(formData: LovenseSettings) {
        window.electronAPI.send('setLovenseSettings', formData);
        reset(formData, {keepDirty: false});
    }

    return (<ContentBox title="Settings" show={false}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormTable>
                <tr>
                    <th>Send connection osc message</th>
                    <td><FormInput type={InputType.Boolean} register={register} name={'sendConnectionOscMessage'} errors={errors} /></td>
                    <td><FormInput type={InputType.Text} register={register} name={'connectionOscMessagePath'} placeholder={'Parameter'} errors={errors}
                                   readOnly={!formWatch.sendConnectionOscMessage} /></td>
                </tr>
            </FormTable>
            <FormControlBar>
                <FormInput type={InputType.Submit} disabled={!isDirty} />
                <FormInput type={InputType.Button} value="Reset" disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}
