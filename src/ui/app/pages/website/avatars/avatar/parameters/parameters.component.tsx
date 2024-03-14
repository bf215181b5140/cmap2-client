import { AvatarDto, ControlParameterDto, ParameterDto, ParametersForm, ReactProps, ValueType } from 'cmap2-shared';
import { ContentBox } from 'cmap2-shared/dist/react';
import { FormTableStyled } from '../../../../../shared/components/form/formTable.component';
import React, { useContext, useEffect } from 'react';
import useCustomFetch from '../../../../../shared/hooks/customFetch.hook';
import { AvatarReducerAction } from '../../avatars.reducer';
import { useFieldArray, useForm } from 'react-hook-form';
import { ContentBoxWidth } from 'cmap2-shared/src';
import FormControlBar from '../../../../../shared/components/form/formControlBar.component';
import enumToInputOptions from '../../../../../shared/util/enumToInputOptions.function';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { parametersSchema } from 'cmap2-shared/src/zodSchemas';
import { EventBus } from '../../../../../shared/util/eventBus';
import { VRChatOscAvatar } from '../../../../../../../shared/interfaces';
import { ModalContext } from '../../../../../components/mainWindow/mainWindow.componenet';
import SubmitInput from '../../../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../../../shared/components/form/inputs/button.component';
import HiddenInput from '../../../../../shared/components/form/inputs/hidden.component';
import Input from '../../../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../../../shared/components/form/inputs/select.component';
import { theme } from '../../../../../theme';

interface ParametersProps extends ReactProps {
    selectedAvatar: AvatarDto;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
    eventBus: EventBus<VRChatOscAvatar>;
}

export default function Parameters({selectedAvatar, avatarDataDispatch, eventBus}: ParametersProps) {

    const customFetch = useCustomFetch();
    const {deleteModal} = useContext(ModalContext);
    const {register, control, handleSubmit, watch, reset, formState: {errors, isDirty}} = useForm<ParametersForm>({
        defaultValues: {
            avatarId: selectedAvatar.id, parameters: [...selectedAvatar.parameters || []]
        }, resolver: zodResolver(parametersSchema)
    });
    const {fields, append, remove, replace} = useFieldArray({control, name: 'parameters'});
    const watchParameters = watch('parameters');

    useEffect(() => {
        eventBus.on('vrcAvatarData', fillFormFromFile);
        return () => eventBus.off('vrcAvatarData', fillFormFromFile);
    }, []);

    useEffect(() => {
        reset({avatarId: selectedAvatar.id, parameters: [...selectedAvatar.parameters || []]});
    }, [selectedAvatar, selectedAvatar.parameters]);

    function fillFormFromFile(data: VRChatOscAvatar) {
        const parameters = data.parameters.filter(p => p.output?.address === p.input?.address).map(p => {
            const param = new ParameterDto();
            param.label = p.name;
            param.path = p.output?.address || '';
            param.valueType = p.output?.type || ValueType.Int;
            return param;
        });
        remove();
        replace(parameters);
    }

    function onSave(formData: ParametersForm) {
        customFetch<ParameterDto[]>('parameters', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.body) avatarDataDispatch({type: 'saveParameters', parameters: res.body, avatarId: selectedAvatar.id});
        });
    }

    function onDelete(index: number) {
        const param = watchParameters[index];
        if (param.id) {
            customFetch('parameters', {
                method: 'DELETE',
                body: JSON.stringify(param),
                headers: {'Content-Type': 'application/json'}
            }).then(res => {
                if (res?.code === 200) avatarDataDispatch({type: 'removeParameter', parameter: param, avatarId: selectedAvatar.id});
            });
        } else {
            remove(index);
        }
    }

    return (<ContentBox title="Parameters" flexBasis={ContentBoxWidth.Full} show={false}>
        <p>
            Optional list of parameters that this avatar supports. Makes it easier to build buttons by letting you pick parameters from this list.
            <br />
            <span style={watchParameters.length > 16 ? {color: theme.colors.error} : undefined}>You can save up to 16 parameters.</span>
        </p>
        <form onSubmit={handleSubmit(onSave)}>
            <HiddenInput name={'avatarId'} />
            <FormTableStyled>
                <thead>
                {watchParameters.length > 0 &&
                    <tr>
                        <th>Label</th>
                        <th>Path</th>
                        <th>Value type</th>
                        <td></td>
                    </tr>
                }
                </thead>
                <tbody>
                {fields.map((item, index) => (
                    <tr>
                        <td>
                            <HiddenInput name={`parameters.${index}.id`} />
                            <Input register={register} name={`parameters.${index}.label`} width="180px" errors={errors} />
                        </td>
                        <td>
                            <Input register={register} name={`parameters.${index}.path`} errors={errors} />
                        </td>
                        <td>
                            <SelectInput options={enumToInputOptions(ValueType)} register={register}
                                       name={`parameters.${index}.valueType`} width="auto" errors={errors} />
                        </td>
                        <td>
                            <ButtonInput text="Delete" onClick={() => deleteModal('parameter', () => onDelete(index))} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </FormTableStyled>
            <hr />
            <FormControlBar>
                <ButtonInput text="Add new" disabled={watchParameters.length >= 16} onClick={() => append(new ControlParameterDto())} />
                <SubmitInput disabled={!isDirty || watchParameters.length > 16} />
                <ButtonInput text="Reset" disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}
