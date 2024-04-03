import { ContentBox } from 'cmap2-shared/dist/react';
import { LovenseSettingsSchema, LovenseSettings } from '../../../../../shared/lovense';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import React, { useEffect } from 'react';
import FormTable from '../../../shared/components/form/formTable.component';
import FormControlBar from '../../../shared/components/form/formControlBar.component';
import SubmitInput from '../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../shared/components/form/inputs/button.component';
import CheckboxInput from '../../../shared/components/form/inputs/checkbox.component';
import ParameterInput from '../../../shared/components/form/inputs/parameterInput/parameterInput.component';

export default function Settings() {
    const {register, reset, watch, formState: {errors, isDirty}, handleSubmit, setValue} = useForm<LovenseSettings>({resolver: zodResolver(LovenseSettingsSchema)});
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
                    <td><CheckboxInput register={register} name={'sendConnectionOscMessage'} errors={errors} /></td>
                    <td><ParameterInput register={register} name={'connectionOscMessagePath'} placeholder={'Parameter'} errors={errors}
                                        readOnly={!formWatch.sendConnectionOscMessage} setValue={setValue} defaultType={'input'} /></td>
                </tr>
            </FormTable>
            <FormControlBar>
                <SubmitInput disabled={!isDirty} />
                <ButtonInput text="Reset" disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}
