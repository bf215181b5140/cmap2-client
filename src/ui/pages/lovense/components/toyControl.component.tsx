import { ContentBox } from 'cmap2-shared/dist/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FieldOption } from 'cmap2-shared';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { FormTableStyled } from '../../../shared/components/form/formTable.component';
import FormControlBar from '../../../shared/components/form/formControlBar.component';
import React, { useContext, useEffect } from 'react';
import { ToyActionType, ToyCommandParameterForm, ToyCommandParameterFormSchema } from '../../../../shared/lovense';
import { Toy } from 'lovense';
import { ModalContext } from '../../../app/mainWindow/mainWindow.componenet';
import SubmitInput from '../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../shared/components/form/inputs/button.component';
import Input from '../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../shared/components/form/inputs/select.component';
import NumberInput from '../../../shared/components/form/inputs/number.component';

interface ToyControlProps {
    toyList: Toy[] | undefined;
}

export default function ToyControl({toyList}: ToyControlProps) {

    const {deleteModal} = useContext(ModalContext);
    const {register, control, handleSubmit, watch, reset, formState: {errors, isDirty}} = useForm<ToyCommandParameterForm>({
        defaultValues: {toyCommandParameters: []}, resolver: zodResolver(ToyCommandParameterFormSchema)
    });

    const {fields, append, remove} = useFieldArray({control, name: 'toyCommandParameters'});

    const watchParameters = watch('toyCommandParameters');

    useEffect(() => {
      window.electronAPI.get('getToyCommandParameters').then(toyCommandParameters => {
          reset({ toyCommandParameters }, {keepDirty: false});
      });
    }, []);

    function onAdd() {
        append({
            parameterPath: '',
            action: ToyActionType.All,
            timeSec: 1,
            toy: ''
        });
    }

    function onsubmit(formData: ToyCommandParameterForm) {
        window.electronAPI.send('setToyCommandParameters', formData.toyCommandParameters);
        reset(formData, {keepDirty: false});
    }

    function ToyActionTypeOptions(): FieldOption[] {
        return Object.keys(ToyActionType)
            .map((key: string) => ({key: ToyActionType[key as keyof typeof ToyActionType], value: ToyActionType[key as keyof typeof ToyActionType]}));
    }

    return (<ContentBox title="Toy control" show={false}>
        <p>Control Lovense toys based on your avatar parameters VRChat sends.</p>
        <form onSubmit={handleSubmit(onsubmit)}>
            <FormTableStyled>
                <thead>
                {watchParameters.length > 0 &&
                    <tr>
                        <th>VRChar parameter</th>
                        <th>Lovense toy action</th>
                        <th>Time (seconds)</th>
                        <th>Toy id</th>
                    </tr>
                }
                </thead>
                <tbody>
                {fields.map((item, index) => (
                    <tr key={index}>
                        <td>
                            <Input name={`toyCommandParameters.${index}.parameterPath`} register={register} errors={errors} />
                        </td>
                        <td>
                            <SelectInput name={`toyCommandParameters.${index}.ToyActionType`} width="160px" register={register} errors={errors}
                                       options={ToyActionTypeOptions()} />
                        </td>
                        <td>
                            <NumberInput name={`toyCommandParameters.${index}.timeSec`} width="120px" register={register}
                                       errors={errors} />
                        </td>
                        <td>
                            {/* todo add text + select input with toyList */}
                            <Input name={`toyCommandParameters.${index}.toy`} register={register} errors={errors} />
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
