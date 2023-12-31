import { ContentBox } from 'cmap2-shared/dist/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { InputType, FieldOption } from 'cmap2-shared';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import FormInput from '../../../shared/components/form/formInput.component';
import { FormTableStyled } from '../../../shared/components/form/formTable.component';
import FormControlBar from '../../../shared/components/form/formControlBar.component';
import React, { useEffect } from 'react';
import { ToyActionType, ToyCommandParameterForm, ToyCommandParameterFormSchema } from '../../../../shared/lovense';
import { Toy } from 'lovense';

interface ToyControlProps {
    toyList: Toy[] | undefined;
}

export default function ToyControl({ toyList }: ToyControlProps) {

    const {register, control, handleSubmit, watch, reset, formState: {errors, isDirty}} = useForm<ToyCommandParameterForm>({
        defaultValues: { toyCommandParameters: [] }, resolver: zodResolver(ToyCommandParameterFormSchema)
    });

    const {fields, append, remove} = useFieldArray({control, name: 'toyCommandParameters'});

    const watchParameters = watch('toyCommandParameters');

    useEffect(() => {
      window.electronAPI.getToyCommandParameters().then(toyCommandParameters => {
          console.log('getToyCommandParameters', toyCommandParameters);
          reset({ toyCommandParameters }, {keepDirty: false});
      })
    }, [])

    function onAdd() {
        append({
            parameterPath: '',
            action: ToyActionType.All,
            timeSec: 1,
            toy: ''
        });
    }

    function onsubmit(formData: ToyCommandParameterForm) {
        window.electronAPI.setToyCommandParameters(formData.toyCommandParameters);
    }

    function ToyActionTypeOptions(): FieldOption[] {
        return Object.keys(ToyActionType).map((key: string) => ({key: ToyActionType[key as keyof typeof ToyActionType], value: ToyActionType[key as keyof typeof ToyActionType]}));
    }

    return (<ContentBox title="Toy control">
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
                            <FormInput type={InputType.Text} name={`toyCommandParameters.${index}.parameterPath`} register={register} errors={errors} />
                        </td>
                        <td>
                            <FormInput type={InputType.Select} name={`toyCommandParameters.${index}.ToyActionType`} width='160px' register={register} errors={errors}
                                       options={ToyActionTypeOptions()} />
                        </td>
                        <td>
                            <FormInput type={InputType.Number} name={`toyCommandParameters.${index}.timeSec`} width='120px' register={register} errors={errors} />
                        </td>
                        <td>
                            {/* todo add text + select input with toyList */}
                            <FormInput type={InputType.Text} name={`toyCommandParameters.${index}.toy`} register={register} errors={errors} />
                        </td>
                        <td>
                            <FormInput type={InputType.Button} value={'Delete'} onClick={() => remove(index)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </FormTableStyled>
            <hr />
            <FormControlBar>
                <FormInput type={InputType.Button} value="Add new" onClick={onAdd} />
                <FormInput type={InputType.Submit} disabled={!isDirty} />
                <FormInput type={InputType.Button} value="Reset" disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}
