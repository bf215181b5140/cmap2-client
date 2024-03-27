import { Toy } from 'lovense';
import { useFieldArray, useForm } from 'react-hook-form';
import { ToyCommandOscMessageForm, ToyCommandOscMessageFormSchema } from '../../../../../shared/lovense';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import React, { useContext, useEffect } from 'react';
import { FieldOption, ParameterValueType } from 'cmap2-shared';
import { ContentBox } from 'cmap2-shared/dist/react';
import { FormTableStyled } from '../../../shared/components/form/formTable.component';
import FormControlBar from '../../../shared/components/form/formControlBar.component';
import { ModalContext } from '../../../components/mainWindow/mainWindow.componenet';
import SubmitInput from '../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../shared/components/form/inputs/button.component';
import Input from '../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../shared/components/form/inputs/select.component';
import ParameterInput from '../../../shared/components/form/inputs/parameterInput.component';

interface ToyControlProps {
    toyList: Toy[] | undefined;
}

export default function OscControl({toyList}: ToyControlProps) {

    const {deleteModal} = useContext(ModalContext);
    const {register, control, handleSubmit, watch, reset, formState: {errors, isDirty}, setValue} = useForm<ToyCommandOscMessageForm>({
        defaultValues: {toyCommandOscMessages: []}, resolver: zodResolver(ToyCommandOscMessageFormSchema)
    });

    const {fields, append, remove} = useFieldArray({control, name: 'toyCommandOscMessages'});

    const watchParameters = watch('toyCommandOscMessages');

    useEffect(() => {
        window.electronAPI.get('getToyCommandOscMessages').then(toyCommandOscMessages => {
            reset({ toyCommandOscMessages }, {keepDirty: false});
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
        reset(formData, {keepDirty: false});
    }

    function valueTypeOptions(): FieldOption[] {
        return Object.keys(ParameterValueType).map((key: string) => ({key: ParameterValueType[key as keyof typeof ParameterValueType], value: ParameterValueType[key as keyof typeof ParameterValueType]}));
    }

    return (<ContentBox title="Osc control" show={false}>
        <p>Send osc messages to VRChat based on what toy is being used.</p>
        <form onSubmit={handleSubmit(onsubmit)}>
            <FormTableStyled>
                <thead>
                {watchParameters.length > 0 &&
                    <tr>
                        <th>Toy id</th>
                        <th>VRChat parameter</th>
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
                            <ButtonInput text="Delete" onClick={() => deleteModal('setting', () => remove(index))} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </FormTableStyled>
            <hr />
            <FormControlBar>
                <ButtonInput text="Add new" onClick={onAdd} />
                <SubmitInput disabled={!isDirty} />
                <ButtonInput text="Reset" disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}
