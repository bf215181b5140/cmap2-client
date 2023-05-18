import { InputType, ParameterDto, ReactProps, ValueType } from 'cmap2-shared';
import { ContentBox } from 'cmap2-shared/src/components/contentBox.component';
import { FormTable } from '../../../shared/components/form/formTable.component';
import FormInput from '../../../shared/components/form/formInput.component';
import React, { useEffect } from 'react';
import AddNewButton from '../layout/addNew.button';
import useCustomFetch from '../../../shared/hooks/customFetch.hook';
import { AvatarReducerAction } from '../avatar.reducer';
import { useFieldArray, useForm } from 'react-hook-form';
import { VRChatOscAvatar } from '../../../../shared/interfaces';

interface ParametersForm {
    avatarId: string,
    parameters: ParameterDto[]
}

interface ParametersProps extends ReactProps {
    parameters: ParameterDto[];
    avatarId: string;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function Parameters({parameters, avatarId, avatarDataDispatch}: ParametersProps) {

    const customFetch = useCustomFetch();
    const {register, control, handleSubmit, reset, formState: {errors, isDirty}} = useForm<ParametersForm>({defaultValues: {parameters: [...parameters]}});
    const {fields, append, remove} = useFieldArray({control, name: 'parameters'});

    useEffect(() => {
        reset({avatarId, parameters});
    }, [])

    function onSave(formData: ParametersForm) {
        console.log(formData);

        // customFetch<ParameterDto[]>('parameters', {
        //     method: 'PUT',
        //     body: JSON.stringify(formData),
        //     headers: {'Content-Type': 'application/json'}
        // }).then(res => {
        // if (res?.code === 201 && res.body) avatarDataDispatch({type: 'saveParameters', parameters: res.body, avatarId: avatarId});
        // });
    }

    function onReadOscAvatarFile(file: string) {
        const oscAvatarData: VRChatOscAvatar = JSON.parse(file);
        const newParameters = oscAvatarData.parameters.filter(p => p.output && p.input && p.output?.address === p.input?.address).map(p => {
            const newParameter = new ParameterDto();
            newParameter.label = p.name;
            newParameter.path = p.output!.address;
            newParameter.valueType = p.output!.type;
            return newParameter;
        })
        reset({avatarId, parameters: newParameters}); // todo set dirty?
    }

    return (<ContentBox title='Parameters'>
        <p>Optional list of parameters that this avatar supports. Makes it easier to build button by letting you pick parameters from this list.</p>
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
                        {/* TODO FILE UPLOAD */}
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
