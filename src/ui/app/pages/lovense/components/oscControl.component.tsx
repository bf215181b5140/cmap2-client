import { Toy } from 'lovense';
import { useFieldArray, useForm } from 'react-hook-form';
import { ToyCommandOscMessageForm, ToyCommandOscMessageFormSchema } from '../../../../../shared/lovense';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import React, { useEffect } from 'react';
import { FieldOption, ParameterValueType } from 'cmap2-shared';
import { FormTableStyled } from '../../../shared/components/form/formTable.component';
import FormControlBar from '../../../shared/components/form/formControlBar.component';
import SubmitInput from '../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../shared/components/form/inputs/button.component';
import Input from '../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../shared/components/form/inputs/select.component';
import ParameterInput from '../../../shared/components/form/inputs/parameterInput/parameterInput.component';
import ContentBox from '../../../shared/components/contentBox/contentBox.component';
import IconButton from '../../../shared/components/buttons/iconButton.component';

interface ToyControlProps {
    toyList: Toy[] | undefined;
}

export default function OscControl({ toyList }: ToyControlProps) {

    const { register, control, handleSubmit, watch, reset, formState: { errors, isDirty }, setValue } = useForm<ToyCommandOscMessageForm>({
        defaultValues: { toyCommandOscMessages: [] }, resolver: zodResolver(ToyCommandOscMessageFormSchema)
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'toyCommandOscMessages' });

    const watchParameters = watch('toyCommandOscMessages');

    useEffect(() => {
        window.electronAPI.get('getToyCommandOscMessages').then(toyCommandOscMessages => {
            reset({ toyCommandOscMessages }, { keepDirty: false });
        });
    }, []);

    function onAdd() {
        append({
            toy: '',
            parameterPath: '',
            valueType: ParameterValueType.Bool,
        });
    }

    function onsubmit(formData: ToyCommandOscMessageForm) {
        window.electronAPI.send('setToyCommandOscMessages', formData.toyCommandOscMessages);
        reset(formData, { keepDirty: false });
    }

    function valueTypeOptions(): FieldOption[] {
        return Object.keys(ParameterValueType).map((key: string) => ({
            key: ParameterValueType[key as keyof typeof ParameterValueType], value: ParameterValueType[key as keyof typeof ParameterValueType]
        }));
    }

    return (<ContentBox contentTitle={'Osc control'} infoContent={LovenseOscControlInfo()}>
        <form onSubmit={handleSubmit(onsubmit)}>
            <FormTableStyled>
                <thead>
                {watchParameters.length > 0 &&
                    <tr>
                        <th>Toy id</th>
                        <th>Parameter</th>
                        <th>Parameter type</th>
                    </tr>
                }
                </thead>
                <tbody>
                {fields.map((item, index) => (
                    <tr key={index}>
                        <td>
                            {/* todo add text + select input with toyList */}
                            <Input name={`toyCommandOscMessages.${index}.toy`} register={register} errors={errors} />
                        </td>
                        <td>
                            <ParameterInput register={register} name={`toyCommandOscMessages.${index}.parameterPath`} errors={errors}
                                            setValue={setValue} defaultType={'input'} />
                        </td>
                        <td>
                            <SelectInput name={`toyCommandOscMessages.${index}.valueType`} width="160px" register={register}
                                         errors={errors}
                                         options={valueTypeOptions()} />
                        </td>
                        <td>
                            <IconButton style={'delete'} size={'small'} deleteKeyword={'setting'} onClick={() => remove(index)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </FormTableStyled>
            <hr />
            <FormControlBar>
                <IconButton style={'add'} size={'small'} onClick={onAdd} />
                <hr />
                <IconButton style={'save'} disabled={!isDirty} />
                <IconButton style={'reset'} disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}

function LovenseOscControlInfo() {
    return (<>
        <p>Send osc messages to VRChat when a toy is being used (through this application).
            <ul>
                <li><b>Toy id</b>: which toy will send a parameter when used. Leave empty for any toy.</li>
                <li><b>Parameter</b>: parameter that will be sent.</li>
                <li><b>Parameter type</b>:
                    <ul>
                        <li><b>Bool</b>: sends true/false when toy starts vibrating or stop vibrating.</li>
                        <li><b>Int</b>: sends current vibration strength, for most toys this is between 0 and 20.</li>
                        <li><b>Float</b>: sends current vibration strength as "percentage" of what the maximum vibration is for that toy, between 0 and 1.</li>
                    </ul>
                </li>
            </ul>
        </p>
    </>);
}
