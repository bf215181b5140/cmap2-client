import { LovenseSettingsSchema, LovenseSettings } from '../../../../../shared/lovense';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import React, { useEffect } from 'react';
import FormTable from '../../../shared/components/form/formTable.component';
import FormControlBar from '../../../shared/components/form/formControlBar.component';
import CheckboxInput from '../../../shared/components/form/inputs/checkbox.component';
import ParameterInput from '../../../shared/components/form/inputs/parameterInput/parameterInput.component';
import ContentBox from '../../../shared/components/contentBox/contentBox.component';
import IconButton from '../../../shared/components/buttons/iconButton.component';
import InfoTooltipIcon from '../../../shared/components/infoTooltipIcon.component';

export default function Settings() {
    const { register, reset, watch, formState: { errors, isDirty }, handleSubmit, setValue } = useForm<LovenseSettings>({
        resolver: zodResolver(LovenseSettingsSchema)
    });
    const formWatch = watch();

    useEffect(() => {
        window.electronAPI.get('getLovenseSettings').then(lovenseSettings => reset(lovenseSettings, { keepDirty: false }));
    }, []);

    function onSubmit(formData: LovenseSettings) {
        window.electronAPI.send('setLovenseSettings', formData);
        reset(formData, { keepDirty: false });
    }

    return (<ContentBox contentTitle={'Settings'}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormTable>
                <tr>
                    <th>
                        <InfoTooltipIcon title={'Will send a bool parameter to VRChat with true/false when you connect or disconnect from lovense.'}>
                            Send connection osc message
                        </InfoTooltipIcon>
                    </th>
                    <td><CheckboxInput register={register} name={'sendConnectionOscMessage'} errors={errors} /></td>
                    <td><ParameterInput register={register} name={'connectionOscMessagePath'} placeholder={'Parameter'} errors={errors}
                                        readOnly={!formWatch.sendConnectionOscMessage} setValue={setValue} defaultType={'input'} /></td>
                </tr>
            </FormTable>
            <FormControlBar>
                <IconButton type={'save'} disabled={!isDirty} />
                <IconButton type={'reset'} disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}
