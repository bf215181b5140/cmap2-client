import { ControlParameterDto, ControlParametersForm, FieldOption, InputType, ParameterRole, ReactProps, TierDto, ValueType } from 'cmap2-shared';
import { FormTableStyled } from '../../../../shared/components/form/formTable.component';
import FormInput from '../../../../shared/components/form/formInput.component';
import React from 'react';
import useCustomFetch from '../../../../shared/hooks/customFetch.hook';
import { AvatarReducerAction } from '../../avatars.reducer';
import { useFieldArray, useForm } from 'react-hook-form';
import { ContentBoxWidth } from 'cmap2-shared/src';
import FormControlBar from '../../../../shared/components/form/formControlBar.component';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { controlParametersSchema } from 'cmap2-shared/src/zodSchemas';
import { ContentBox } from 'cmap2-shared/dist/react/';

interface ControlParametersProps extends ReactProps {
    controlParameters: ControlParameterDto[];
    avatarId: string;
    clientTier: TierDto;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function ControlParameters({controlParameters, avatarId, clientTier, avatarDataDispatch}: ControlParametersProps) {

    const customFetch = useCustomFetch();
    const {register, control, handleSubmit, watch, reset, formState: {errors, isDirty}} = useForm<ControlParametersForm>({
        defaultValues: {
            avatarId: avatarId, controlParameters: [...controlParameters]
        }, resolver: zodResolver(controlParametersSchema)
    });
    const {fields, append, remove} = useFieldArray({control, name: 'controlParameters'});
    const watchParameters = watch('controlParameters');

    function onSave(formData: ControlParametersForm) {
        console.log('saving: ', formData)
        customFetch<ControlParameterDto[]>('controlParameters', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.body) avatarDataDispatch({type: 'saveControlParameters', controlParameters: res.body, avatarId: avatarId});
        });
    }

    function parameterRoleOptions(): FieldOption[] {
        return Object.keys(ParameterRole).filter(key => {
            if (key === ParameterRole.Exp) return clientTier.exp;
            if (key === ParameterRole.HP) return clientTier.hp;
            return true;
        }).map((key: string) => ({key: key, value: key}));
    }

    function valueTypeOptions(role: ParameterRole): FieldOption[] {
        return Object.keys(ValueType).filter(key => {
            if (role === ParameterRole.Exp) return key === ValueType.Int;
            if (role === ParameterRole.HP) return key === ValueType.Int;
            return true;
        }).map((key: string) => ({key: key, value: key}));
    }

    function valuePrimaryPlaceholder(role: ParameterRole): string {
        switch (role) {
            case ParameterRole.Callback:
                return 'Value';
            case ParameterRole.Exp:
                return 'Min exp';
            case ParameterRole.HP:
                return 'Min HP';
        }
    }

    function valueSecondaryPlaceholder(role: ParameterRole): string {
        switch (role) {
            case ParameterRole.Callback:
                return 'Seconds';
            case ParameterRole.Exp:
                return 'Max exp';
            case ParameterRole.HP:
                return 'Max HP';
        }
    }

    return (<ContentBox title="Control parameters" flexBasis={ContentBoxWidth.Full}>
        <p>Utility parameters that can be used to control avatar. These aren't displayed or interactable, instead they can be used to bind to other actions
            which trigger them.</p>
        <form onSubmit={handleSubmit(onSave)}>
            <FormInput type={InputType.Hidden} register={register} name={'avatarId'} />
            <FormTableStyled>
                <thead>
                {watchParameters.length > 0 &&
                    <tr>
                        <th>Label</th>
                        <th>Parameter role</th>
                        <th>Path</th>
                        <th colSpan={2}>Value</th>
                        <th>Value type</th>
                        <td></td>
                    </tr>
                }
                </thead>
                <tbody>
                {fields.map((item, index) => (
                    <tr>
                        <td>
                            <FormInput type={InputType.Hidden} register={register} name={`controlParameters.${index}.id`} />
                            <FormInput type={InputType.Text} register={register} name={`controlParameters.${index}.label`} width="200px" errors={errors} />
                        </td>
                        <td>
                            <FormInput type={InputType.Select} register={register} name={`controlParameters.${index}.role`} width="auto" errors={errors}
                                       options={parameterRoleOptions()} />
                        </td>
                        <td>
                            <FormInput type={InputType.Text} register={register} name={`controlParameters.${index}.path`} width="250px" errors={errors} />
                        </td>
                        <td>
                            <FormInput type={InputType.Text} register={register} name={`controlParameters.${index}.valuePrimary`} width="100px" errors={errors}
                                       placeholder={valuePrimaryPlaceholder(watchParameters[index].role)} />
                        </td>
                        <td>
                            <FormInput type={InputType.Text} register={register} name={`controlParameters.${index}.valueSecondary`} width="100px"
                                       errors={errors} placeholder={valueSecondaryPlaceholder(watchParameters[index].role)} />
                        </td>
                        <td>
                            <FormInput type={InputType.Select} register={register} name={`controlParameters.${index}.valueType`} width="auto" errors={errors}
                                       options={valueTypeOptions(watchParameters[index].role)} />
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
                <FormInput type={InputType.Button} value="Add new" onClick={() => append(new ControlParameterDto())} />
                <FormInput type={InputType.Submit} disabled={!isDirty} />
                <FormInput type={InputType.Button} value="Reset" disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}
