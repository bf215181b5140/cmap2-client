import { FormTableStyled } from '../../../../../shared/components/form/formTable.component';
import React, { useContext, useEffect } from 'react';
import useCmapFetch from '../../../../../shared/hooks/cmapFetch.hook';
import { AvatarReducerAction } from '../../avatars.reducer';
import { useFieldArray, useForm } from 'react-hook-form';
import { ContentBoxWidth } from 'cmap2-shared/src';
import FormControlBar from '../../../../../shared/components/form/formControlBar.component';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { ContentBox } from 'cmap2-shared/dist/react/';
import { ModalContext } from '../../../../../components/mainWindow/mainWindow.componenet';
import SubmitInput from '../../../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../../../shared/components/form/inputs/button.component';
import HiddenInput from '../../../../../shared/components/form/inputs/hidden.component';
import Input from '../../../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../../../shared/components/form/inputs/select.component';
import { AvatarDTO, ControlParametersFormDTO, ControlParametersFormSchema, FieldOption, ControlParameterRole, ReactProps, TierDTO, ParameterValueType, ControlParameterDTO } from 'cmap2-shared';
import ParameterInput from '../../../../../shared/components/form/inputs/parameterInput/parameterInput.component';
import DeleteButton from '../../../../../shared/components/buttons/deleteButton.component';

interface ControlParametersProps extends ReactProps {
    selectedAvatar: AvatarDTO;
    clientTier: TierDTO;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function ControlParameters({selectedAvatar, clientTier, avatarDataDispatch}: ControlParametersProps) {

    const customFetch = useCmapFetch();
    const {deleteModal} = useContext(ModalContext);
    const {register, control, handleSubmit, watch, reset, formState: {errors, isDirty}, setValue} = useForm<ControlParametersFormDTO>({
        defaultValues: {
            avatarId: selectedAvatar.id, controlParameters: [...selectedAvatar.controlParameters || []]
        }, resolver: zodResolver(ControlParametersFormSchema)
    });
    const {fields, append, remove} = useFieldArray({control, name: 'controlParameters'});
    const watchParameters = watch('controlParameters')!;

    useEffect(() => {
        reset({avatarId: selectedAvatar.id, controlParameters: [...selectedAvatar.controlParameters || []]});
    }, [selectedAvatar, selectedAvatar.controlParameters]);

    function onSave(formData: ControlParametersFormDTO) {
        customFetch<ControlParameterDTO[]>('controlParameters', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }, data => {
            avatarDataDispatch({type: 'saveControlParameters', controlParameters: data, avatarId: selectedAvatar.id!});
        });
    }

    function onDelete(index: number) {
        if (!watchParameters) return;
        const param = watchParameters[index];
        if (param.id) {
            customFetch('controlParameters', {
                method: 'DELETE',
                body: JSON.stringify(param),
                headers: {'Content-Type': 'application/json'}
            }, () => {
                avatarDataDispatch({type: 'removeControlParameter', controlParameter: {...param, id: param.id!}, avatarId: selectedAvatar.id!});
            });
        } else {
            remove(index);
        }
    }

    function parameterRoleOptions(index: number): FieldOption[] {
        return Object.keys(ControlParameterRole)
            // filter out useCost and HP if clientTier doesn't support it OR there is already one selected
            .filter(key => {
                if (key === ControlParameterRole.UseCost) {
                    return clientTier.useCost && !watchParameters.find((p,
                        i) => p.role === ControlParameterRole.UseCost && i !== index);
                }
                if (key === ControlParameterRole.HP) return clientTier.hp && !watchParameters.find((p, i) => p.role === ControlParameterRole.HP && i !== index);
                return true;
            }).map((key: string) => ({key: ControlParameterRole[key as keyof typeof ControlParameterRole], value: ControlParameterRole[key as keyof typeof ControlParameterRole]}));
    }

    function valueTypeOptions(role: ControlParameterRole): FieldOption[] {
        return Object.keys(ParameterValueType).filter(key => {
            if (role === ControlParameterRole.UseCost) return key === ParameterValueType.Int;
            if (role === ControlParameterRole.HP) return key === ParameterValueType.Int;
            return true;
        }).map((key: string) => ({key: key, value: key}));
    }

    function valuePrimaryPlaceholder(role: ControlParameterRole): string {
        switch (role) {
            case ControlParameterRole.Callback:
                return 'Value';
            case ControlParameterRole.UseCost:
                return 'Min cost';
            case ControlParameterRole.HP:
                return 'Min HP';
        }
    }

    function valueSecondaryPlaceholder(role: ControlParameterRole): string {
        switch (role) {
            case ControlParameterRole.Callback:
                return 'Seconds';
            case ControlParameterRole.UseCost:
                return 'Max cost';
            case ControlParameterRole.HP:
                return 'Max HP';
        }
    }

    return (<ContentBox title="Control parameters" flexBasis={ContentBoxWidth.Full} show={false}>
        <p>Utility parameters that can be used to control avatar. These aren't displayed or interactable, instead they can be used to bind to other actions
            which trigger them.</p>
        <form onSubmit={handleSubmit(onSave)}>
            <HiddenInput register={register} name={'avatarId'} />
            <FormTableStyled>
                <thead>
                {watchParameters && watchParameters.length > 0 &&
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
                    <tr key={index}>
                        <td>
                            <HiddenInput register={register} name={`controlParameters.${index}.id`} />
                            <Input register={register} name={`controlParameters.${index}.label`} width="150px" errors={errors} />
                        </td>
                        <td>
                            <SelectInput register={register} name={`controlParameters.${index}.role`} width="auto" errors={errors}
                                       options={parameterRoleOptions(index)} />
                        </td>
                        <td>
                            <ParameterInput register={register} name={`controlParameters.${index}.path`} errors={errors} setValue={setValue} />
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
                            <DeleteButton onClick={() => onDelete(index)} keyword={'control parameter'} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </FormTableStyled>
            <hr />
            <FormControlBar>
                <ButtonInput text="Add new" disabled={watchParameters.length >= Math.min(8, clientTier.controlParameters)} onClick={() => append({
                    id: null,
                    label: '',
                    path: '',
                    role: ControlParameterRole.Callback,
                    valueType: ParameterValueType.Int,
                    valuePrimary: '',
                    valueSecondary: null
                })} />
                <SubmitInput disabled={!isDirty} />
                <ButtonInput text="Reset" disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}
