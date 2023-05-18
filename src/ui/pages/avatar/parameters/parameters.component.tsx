import { InputType, LayoutDto, ParameterDto, ReactProps } from "cmap2-shared";
import { ContentBox } from "cmap2-shared/src/components/contentBox.component";
import { FormTable } from "../../../shared/components/form/formTable.component";
import FormInput from "../../../shared/components/form/formInput.component";
import React from "react";
import AddNewButton from "../layout/addNew.button";
import useCustomFetch from "../../../shared/hooks/customFetch.hook";
import { AvatarReducerAction } from "../avatar.reducer";
import { useFieldArray, useForm } from "react-hook-form";

interface ParametersProps extends ReactProps {
    parameters: ParameterDto[];
    avatarId: string;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function Parameters({parameters, avatarId, avatarDataDispatch}: ParametersProps) {

    const customFetch = useCustomFetch();
    const {register, control, handleSubmit, reset, formState: {errors, isDirty}} = useForm({defaultValues: {parameters: [...parameters]}});
    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: 'parameters'
    });

    function onSave(formData: any) {
        customFetch<ParameterDto[]>('parameter', {
            method: 'PUT',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            // if (res?.code === 200) {
            //     avatarDataDispatch({type: 'editLayout', layout: formData, avatarId: avatar.id});
            //     reset({
            //         id: formData.id,
            //         label: formData.label,
            //         order: order,
            //         parentId: formData.id
            //     });
            // }
            // if (res?.code === 201 && res.body) avatarDataDispatch({type: 'addLayout', layout: res.body, avatarId: avatar.id});
        });
    }

    function onDelete(parameter: ParameterDto) {
        customFetch('parameter', {
            method: 'DELETE',
            body: JSON.stringify(parameter),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            // if (res?.code === 200) avatarDataDispatch({type: 'removeLayout', layout: layout, avatarId: avatar.id});
        });
    }

    return (<ContentBox title='Parameters'>
        <p><span>Optional</span> list of parameters this avatar supports. Makes it easier to build button by letting you pick parameters from a list</p>
        <form onSubmit={handleSubmit(onSave)}>
            <FormInput type={InputType.Hidden} register={register} name={'avatarId'} />
            <FormTable width="100%">

                {fields.map((item, index) => (
                    <tr>
                        <td>
                            <FormInput type={InputType.Text} register={register} name={`parameters.${index}.label`} errors={errors} />
                        </td>
                        <td>
                            <FormInput type={InputType.Text} register={register} name={`parameters.${index}.path`} errors={errors} />
                        </td>
                        <td>
                            <FormInput type={InputType.Text} register={register} name={`parameters.${index}.valueType`} errors={errors} />
                        </td>
                        <td>
                            <FormInput type={InputType.Button} value={'Delete'} onClick={() => remove(index)} />
                        </td>
                    </tr>
                ))}
                <tr>
                    <td colSpan={3}>
                        <AddNewButton onClick={() => append(new ParameterDto())} />
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <FormInput type={InputType.Submit} disabled={!isDirty} />
                    </td>
                </tr>
            </FormTable>

        </form>
    </ContentBox>);
}
