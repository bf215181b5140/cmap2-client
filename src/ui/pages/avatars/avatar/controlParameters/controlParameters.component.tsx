import { AvatarDto, ControlParameterDto, ControlParametersForm, FieldOption, ParameterRole, ReactProps, TierDto, ValueType } from 'cmap2-shared';
import { FormTableStyled } from '../../../../shared/components/form/formTable.component';
import React, { useContext, useEffect } from 'react';
import useCustomFetch from '../../../../shared/hooks/customFetch.hook';
import { AvatarReducerAction } from '../../avatars.reducer';
import { useFieldArray, useForm } from 'react-hook-form';
import { ContentBoxWidth } from 'cmap2-shared/src';
import FormControlBar from '../../../../shared/components/form/formControlBar.component';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { controlParametersSchema } from 'cmap2-shared/src/zodSchemas';
import { ContentBox } from 'cmap2-shared/dist/react/';
import { ModalContext } from '../../../../app/mainWindow/mainWindow.componenet';
import SubmitInput from '../../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import HiddenInput from '../../../../shared/components/form/inputs/hidden.component';
import Input from '../../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../../shared/components/form/inputs/select.component';

interface ControlParametersProps extends ReactProps {
    selectedAvatar: AvatarDto;
    clientTier: TierDto;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function ControlParameters({selectedAvatar, clientTier, avatarDataDispatch}: ControlParametersProps) {

    const customFetch = useCustomFetch();
    const {deleteModal} = useContext(ModalContext);
    const {register, control, handleSubmit, watch, reset, formState: {errors, isDirty}} = useForm<ControlParametersForm>({
        defaultValues: {
            avatarId: selectedAvatar.id, controlParameters: [...selectedAvatar.controlParameters || []]
        }, resolver: zodResolver(controlParametersSchema)
    });
    const {fields, append, remove} = useFieldArray({control, name: 'controlParameters'});
    const watchParameters = watch('controlParameters');

    useEffect(() => {
        reset({avatarId: selectedAvatar.id, controlParameters: [...selectedAvatar.controlParameters || []]});
    }, [selectedAvatar, selectedAvatar.controlParameters]);

    function onSave(formData: ControlParametersForm) {
        customFetch<ControlParameterDto[]>('controlParameters', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.body) avatarDataDispatch({type: 'saveControlParameters', controlParameters: res.body, avatarId: selectedAvatar.id});
        });
    }

    function onDelete(index: number) {
        const param = watchParameters[index];
        if (param.id) {
            customFetch('controlParameters', {
                method: 'DELETE',
                body: JSON.stringify(param),
                headers: {'Content-Type': 'application/json'}
            }).then(res => {
                if (res?.code === 200) avatarDataDispatch({type: 'removeControlParameter', controlParameter: param, avatarId: selectedAvatar.id});
            });
        } else {
            remove(index);
        }
    }

    function parameterRoleOptions(index: number): FieldOption[] {
        return Object.keys(ParameterRole)
            // filter out useCost and HP if clientTier doesn't support it OR there is already one selected
            .filter(key => {
                if (key === ParameterRole.UseCost) {
                    return clientTier.useCost && !watchParameters.find((p,
                        i) => p.role === ParameterRole.UseCost && i !== index);
                }
                if (key === ParameterRole.HP) return clientTier.hp && !watchParameters.find((p, i) => p.role === ParameterRole.HP && i !== index);
                return true;
            }).map((key: string) => ({key: ParameterRole[key as keyof typeof ParameterRole], value: ParameterRole[key as keyof typeof ParameterRole]}));
    }

    function valueTypeOptions(role: ParameterRole): FieldOption[] {
        return Object.keys(ValueType).filter(key => {
            if (role === ParameterRole.UseCost) return key === ValueType.Int;
            if (role === ParameterRole.HP) return key === ValueType.Int;
            return true;
        }).map((key: string) => ({key: key, value: key}));
    }

    function valuePrimaryPlaceholder(role: ParameterRole): string {
        switch (role) {
            case ParameterRole.Callback:
                return 'Value';
            case ParameterRole.UseCost:
                return 'Min cost';
            case ParameterRole.HP:
                return 'Min HP';
        }
    }

    function valueSecondaryPlaceholder(role: ParameterRole): string {
        switch (role) {
            case ParameterRole.Callback:
                return 'Seconds';
            case ParameterRole.UseCost:
                return 'Max cost';
            case ParameterRole.HP:
                return 'Max HP';
        }
    }

    return (<ContentBox title="Control parameters" flexBasis={ContentBoxWidth.Full} show={false}>
        <p>Utility parameters that can be used to control avatar. These aren't displayed or interactable, instead they can be used to bind to other actions
            which trigger them.</p>
        <form onSubmit={handleSubmit(onSave)}>
            <HiddenInput name={'avatarId'} />
            <FormTableStyled>
                <thead>
                {watchParameters.length > 0 &&
                    <tr>
                        <th>Label</th>
                        <th>Parameter role</th>
                        <th>Path</th>
                        <th colSpan={2}>Values</th>
                        <th>Value type</th>
                        <td></td>
                    </tr>
                }
                </thead>
                <tbody>
                {fields.map((item, index) => (
                    <tr>
                        <td>
                            <HiddenInput name={`controlParameters.${index}.id`} />
                            <Input register={register} name={`controlParameters.${index}.label`} width="180px" errors={errors} />
                        </td>
                        <td>
                            <SelectInput register={register} name={`controlParameters.${index}.role`} width="auto" errors={errors}
                                       options={parameterRoleOptions(index)} />
                        </td>
                        <td>
                            <Input register={register} name={`controlParameters.${index}.path`} errors={errors} />
                        </td>
                        <td>
                            <Input register={register} name={`controlParameters.${index}.valuePrimary`} width="75px" errors={errors}
                                       placeholder={valuePrimaryPlaceholder(watchParameters[index].role)} />
                        </td>
                        <td>
                            <Input register={register} name={`controlParameters.${index}.valueSecondary`} width="100px"
                                       errors={errors} placeholder={valueSecondaryPlaceholder(watchParameters[index].role)} />
                        </td>
                        <td>
                            <SelectInput register={register} name={`controlParameters.${index}.valueType`} width="auto" errors={errors}
                                       options={valueTypeOptions(watchParameters[index].role)} />
                        </td>
                        <td>
                            <ButtonInput text="Delete" onClick={() => deleteModal('control parameter', () => onDelete(index))} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </FormTableStyled>
            <hr />
            <FormControlBar>
                <ButtonInput text="Add new" disabled={watchParameters.length >= Math.min(8, clientTier.controlParameters)} onClick={() => append(new ControlParameterDto())} />
                <SubmitInput disabled={!isDirty} />
                <ButtonInput text="Reset" disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}
