import { ControlParameterDto, InputType, ParameterDto, ParametersForm, ReactProps, ValueType } from 'cmap2-shared';
import { ContentBox } from 'cmap2-shared/dist/react';
import { FormTableStyled } from '../../../../shared/components/form/formTable.component';
import FormInput from '../../../../shared/components/form/formInput.component';
import React, { useEffect } from 'react';
import useCustomFetch from '../../../../shared/hooks/customFetch.hook';
import { AvatarReducerAction } from '../../avatars.reducer';
import { useFieldArray, useForm } from 'react-hook-form';
import { ContentBoxWidth } from 'cmap2-shared/src';
import FormControlBar from '../../../../shared/components/form/formControlBar.component';
import enumToInputOptions from '../../../../shared/util/enumToInputOptions.function';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { parametersSchema } from 'cmap2-shared/src/zodSchemas';
import { EventBus } from '../../../../shared/util/eventBus';
import { VRChatOscAvatar } from '../../../../../shared/interfaces';

interface ParametersProps extends ReactProps {
    parameters: ParameterDto[];
    avatarId: string;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
    eventBus: EventBus<VRChatOscAvatar>;
}

export default function Parameters({parameters, avatarId, avatarDataDispatch, eventBus}: ParametersProps) {

    const customFetch = useCustomFetch();
    const {register, control, handleSubmit, watch, reset, formState: {errors, isDirty}} = useForm<ParametersForm>({
        defaultValues: {
            avatarId: avatarId, parameters: [...parameters]
        }, resolver: zodResolver(parametersSchema)
    });
    const {fields, append, remove, replace} = useFieldArray({control, name: 'parameters'});
    const watchParameters = watch('parameters');

    useEffect(() => {
        eventBus.on('vrcAvatarData', fillFormFromFile);
        return () => eventBus.off('vrcAvatarData', fillFormFromFile);
    }, []);

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
            if (res?.body) avatarDataDispatch({type: 'saveParameters', parameters: res.body, avatarId: avatarId});
        });
    }

    return (<ContentBox title="Parameters" flexBasis={ContentBoxWidth.Full}>
        <p>Optional list of parameters that this avatar supports. Makes it easier to build button by letting you pick parameters from this list.</p>
        <form onSubmit={handleSubmit(onSave)}>
            <FormInput type={InputType.Hidden} register={register} name={'avatarId'} />
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
                            <FormInput type={InputType.Hidden} register={register} name={`parameters.${index}.id`} />
                            <FormInput type={InputType.Text} register={register} name={`parameters.${index}.label`} width="180px" errors={errors} />
                        </td>
                        <td>
                            <FormInput type={InputType.Text} register={register} name={`parameters.${index}.path`} errors={errors} />
                        </td>
                        <td>
                            <FormInput type={InputType.Select} options={enumToInputOptions(ValueType)} register={register}
                                       name={`parameters.${index}.valueType`} width="auto" errors={errors} />
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
