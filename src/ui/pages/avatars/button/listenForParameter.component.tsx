import { ContentBox } from 'cmap2-shared/dist/react';
import React, { useEffect, useState } from 'react';
import { ButtonDto, VrcParameter, ReactProps } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import FormTable from '../../../shared/components/form/formTable.component';
import SubmitInput from '../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../shared/components/form/inputs/button.component';
import Input from '../../../shared/components/form/inputs/input.component';

interface ListenForParameterProps extends ReactProps {
    applyMessage: (data: ButtonDto) => void;
}

export default function ListenForParameter({applyMessage}: ListenForParameterProps) {

    const {register, setValue, reset, formState: {errors, isDirty}, handleSubmit} = useForm<ButtonDto>({defaultValues: {path: '', value: ''}});
    const [listening, setListening] = useState<boolean>(false);

    useEffect(() => {
        window.electronAPI.vrcParameter((event: any, message: VrcParameter) => {
            let value = message.value;
            if (typeof value === 'number') {
                if (Number.isInteger(value)) {
                    value = value.toString();
                } else {
                    value = value.toPrecision(2);
                }
            } else {
                value = value.toString();
            }
            setValue('path', message.path, {shouldDirty: true});
            setValue('value', value, {shouldDirty: true});
            window.electronAPI.forwardOscToRenderer(false);
            setListening(false);
        });
    }, []);

    function forwardOscToRenderer() {
        window.electronAPI.forwardOscToRenderer(true);
        setListening(true);
        reset({path: '', value: ''});
    }

    function onApply(formData: ButtonDto) {
        applyMessage(formData);
        reset({path: '', value: ''});
    }

    return (<ContentBox flexBasis="100%">
        <h2>Listen for next VRChat parameter</h2>
        <form onSubmit={handleSubmit(onApply)}>
            <FormTable>
                <tr>
                    <td><ButtonInput text="Listen" onClick={forwardOscToRenderer} disabled={listening} /></td>
                    <td><Input register={register} name={'path'} errors={errors} placeholder="Parameter" readOnly={true} /></td>
                    <td><Input register={register} name={'value'} errors={errors} placeholder="Parameter value" readOnly={true} /></td>
                    <td><SubmitInput disabled={!isDirty} text="Apply" /></td>
                </tr>
            </FormTable>
        </form>
    </ContentBox>);
}
