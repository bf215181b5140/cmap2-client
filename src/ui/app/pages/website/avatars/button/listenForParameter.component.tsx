import React, { useEffect, useState } from 'react';
import { ButtonDTO, ParameterValueType, ReactProps, VrcParameter } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import FormTable from '../../../../shared/components/form/formTable.component';
import SubmitInput from '../../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import Input from '../../../../shared/components/form/inputs/input.component';
import ContentBox from '../../../../shared/components/contentBox/contentBox.component';

interface ListenForParameterProps extends ReactProps {
    applyMessage: (data: ButtonDTO) => void;
}

export default function ListenForParameter({applyMessage}: ListenForParameterProps) {

    const {register, setValue, reset, formState: {errors, isDirty}, handleSubmit} = useForm<ButtonDTO>({defaultValues: {path: '', value: '', valueType: ParameterValueType.Int}});
    const [listening, setListening] = useState<boolean>(false);

    useEffect(() => {
        const removeListener = window.electronAPI.receive('vrcParameter', (message: VrcParameter) => {
            if (!listening) return;

            let value = message.value;
            let valueType;
            if (typeof value === 'number') {
                if (Number.isInteger(value)) {
                    value = value.toString();
                    valueType = ParameterValueType.Int;
                } else {
                    value = value.toPrecision(2);
                    valueType = ParameterValueType.Float;
                }
            } else {
                value = value.toString();
                valueType = ParameterValueType.Bool;
            }
            setValue('path', message.path, {shouldDirty: true});
            setValue('value', value, {shouldDirty: true});
            setValue('valueType', valueType, {shouldDirty: true});
            setListening(false);
        });

        return () => {
            if (removeListener) removeListener();
        }
    }, [listening]);

    function forwardOscToRenderer() {
        setListening(true);
        reset({path: '', value: '', valueType: ParameterValueType.Int});
    }

    function onApply(formData: ButtonDTO) {
        applyMessage(formData);
        reset({path: '', value: '', valueType: ParameterValueType.Int});
    }

    return (<ContentBox contentTitle={'Listen for next VRChat parameter'} flexBasis="100%">
        <p>Click listen, then use you desired avatar toggle in VRChat. Your parameter will show up here and you can apply it to the button.</p>
        <form onSubmit={handleSubmit(onApply)}>
            <FormTable>
                <tr>
                    <td><ButtonInput text="Listen" onClick={forwardOscToRenderer} disabled={listening} /></td>
                    <td><Input register={register} name={'path'} errors={errors} placeholder="Parameter" readOnly={true} /></td>
                    <td><Input register={register} name={'value'} errors={errors} placeholder="Value" readOnly={true} width={'100px'} /></td>
                    <td><Input register={register} name={'valueType'} errors={errors} placeholder="Value type" readOnly={true} width={'100px'} /></td>
                    <td><SubmitInput disabled={!isDirty} text="Apply" /></td>
                </tr>
            </FormTable>
        </form>
    </ContentBox>);
}
