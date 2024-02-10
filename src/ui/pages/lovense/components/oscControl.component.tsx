import { Toy } from 'lovense';
import { useFieldArray, useForm } from 'react-hook-form';
import { ToyCommandOscMessageForm, ToyCommandOscMessageFormSchema } from '../../../../shared/lovense';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import React, { useContext, useEffect } from 'react';
import { FieldOption, ValueType } from 'cmap2-shared';
import { ContentBox } from 'cmap2-shared/dist/react';
import { FormTableStyled } from '../../../shared/components/form/formTable.component';
import FormControlBar from '../../../shared/components/form/formControlBar.component';
import { ModalContext } from '../../../app/mainWindow/mainWindow.componenet';
import SubmitInput from '../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../shared/components/form/inputs/button.component';
import Input from '../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../shared/components/form/inputs/select.component';

interface ToyControlProps {
    toyList: Toy[] | undefined;
}

export default function OscControl({toyList}: ToyControlProps) {

    const {deleteModal} = useContext(ModalContext);
    const {register, control, handleSubmit, watch, reset, formState: {errors, isDirty}} = useForm<ToyCommandOscMessageForm>({
        defaultValues: {toyCommandOscMessages: []}, resolver: zodResolver(ToyCommandOscMessageFormSchema)
    });

    const {fields, append, remove} = useFieldArray({control, name: 'toyCommandOscMessages'});

    const watchParameters = watch('toyCommandOscMessages');

    useEffect(() => {
        window.electronAPI.getToyCommandOscMessages().then(toyCommandOscMessages => {
            reset({toyCommandOscMessages}, {keepDirty: false});
        });
    }, []);

    function onAdd() {
        append({
            toy: '',
            parameterPath: '',
            valueType: ValueType.Bool,
        });
    }

    function onsubmit(formData: ToyCommandOscMessageForm) {
        window.electronAPI.setToyCommandOscMessages(formData.toyCommandOscMessages);
        reset(formData, {keepDirty: false});
    }

    function valueTypeOptions(): FieldOption[] {
        return Object.keys(ValueType).map((key: string) => ({key: ValueType[key as keyof typeof ValueType], value: ValueType[key as keyof typeof ValueType]}));
    }

    return (<ContentBox title="Osc control" show={false}>
        <p>Send osc messages to VRChat based on what toy is being used.</p>
        <form onSubmit={handleSubmit(onsubmit)}>
            <FormTableStyled>
                <thead>
                {watchParameters.length > 0 &&
                    <tr>
                        <th>Toy id</th>
                        <th>VRChar parameter</th>
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
                            <Input name={`toyCommandOscMessages.${index}.parameterPath`} register={register} errors={errors} />
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
