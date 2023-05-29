import { Content, ContentBox } from 'cmap2-shared/dist/react';
import { AvatarDto, ButtonDto, ButtonImageOrientation, ButtonStyleDto, ButtonType, ClientTier, FieldOption, InputType, LayoutDto, ParameterRole, ReactProps, TierDto, ValueType } from 'cmap2-shared';
import { useNavigate } from 'react-router-dom';
import { ParameterButton } from 'cmap2-shared/dist/react';
import React, { useEffect } from 'react';
import { AvatarReducerAction } from '../avatars.reducer';
import useCustomFetch from '../../../shared/hooks/customFetch.hook';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { buttonSchema } from 'cmap2-shared/src/zodSchemas';
import FormInput, { SelectStyled } from '../../../shared/components/form/formInput.component';
import FileUpload from '../../../shared/components/fileUpload.component';
import { z } from 'zod';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import ListenForParameter from './listenForParameter.component';
import FormTable from '../../../shared/components/form/formTable.component';
import FormControlBar from '../../../shared/components/form/formControlBar.component';
import enumToInputOptions from '../../../shared/util/enumToInputOptions.function';
import TestParameterButton from './testParameterButton';

interface ButtonComponentProps extends ReactProps {
    button: ButtonDto;
    // order: number;
    layout: LayoutDto;
    avatar: AvatarDto;
    buttonStyle: ButtonStyleDto;
    clientTier: TierDto;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function ButtonComponent({button, avatarDataDispatch, avatar, layout, buttonStyle, clientTier}: ButtonComponentProps) {

    const navigate = useNavigate();
    const customFetch = useCustomFetch();
    const {register, setValue, reset, formState: {errors, isDirty}, watch, handleSubmit} = useForm<ButtonDto>({
        defaultValues: {...button, order: 0, parentId: layout.id},
        resolver: zodResolver(buttonSchema)
    });
    const formWatch = watch();

    function onSave(formData: ButtonDto) {
        customFetch<ButtonDto>('button', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.code === 200) {
                avatarDataDispatch({type: 'editButton', button: formData, avatarId: avatar.id, layoutId: layout.id});
                reset({...button, ...formData});
            }
            if (res?.code === 201 && res.body) {
                avatarDataDispatch({type: 'addButton', button: res.body, avatarId: avatar.id, layoutId: layout.id});
                navigate(-1);
            }
        });
    }

    function onDelete(button: ButtonDto) {
        customFetch('button', {
            method: 'DELETE',
            body: JSON.stringify(button),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.code === 200) avatarDataDispatch({type: 'removeButton', button: button, avatarId: avatar.id, layoutId: layout.id});
            navigate(-1);
        });
    }

    function setButtonPicture(picture: string) {
        avatarDataDispatch({type: 'changeButtonPicture', picture: picture, buttonId: button.id, avatarId: avatar.id, layoutId: layout.id});
        button.image = picture;
        setValue('image', picture);
    }

    function setFormDataFromOsc(data: ButtonDto) {
        setValue('path', data.path);
        setValue('value', data.value);
    }

    function controlParameterOptions() {
        const controlParameters = avatar.controlParameters?.filter(cp => cp.role === ParameterRole.Callback).map(cp => ({key: cp.id, value: cp.label})) || [];
        return [{key: '', value: ''}, ...controlParameters];
    }

    function setParameterFromOptions(parameterId: string) {
        const parameter = avatar.parameters?.find(p => p.id === parameterId);
        if (parameter) {
            setValue('path', parameter.path);
            setValue('valueType', parameter.valueType);
        }
    }

    function valuePrimaryPlaceholder(): string {
        switch (formWatch.buttonType) {
            case ButtonType.Button:
                return 'Value';
            case ButtonType.Toggle:
                return 'Active value';
            case ButtonType.Slider:
                return 'Minimum value';
        }
    }

    function valueSecondaryPlaceholder(): string {
        switch (formWatch.buttonType) {
            case ButtonType.Button:
                return '';
            case ButtonType.Toggle:
                return 'Inactive value';
            case ButtonType.Slider:
                return 'Maximum value';
        }
    }

    console.log(formWatch);

    return (<Content flexDirection="row">
        <ContentBox flexBasis="100%">
            <Icon icon="ri-contacts-book-fill" />&nbsp;&nbsp;{avatar.label}&nbsp;
            <Icon icon="ri-arrow-right-s-line" />&nbsp;{layout.label}&nbsp;
            <Icon icon="ri-arrow-right-s-line" />&nbsp;{button.id ? button.label : 'new button'}
        </ContentBox>
        <ContentBox flexGrow={1}>
            <h2>Preview</h2>
            <ParameterButton button={formWatch} buttonStyle={buttonStyle} />
            <br />
            {button.id && formWatch.buttonType !== ButtonType.Slider && <FileUpload parentType="button" parentId={button?.id} uploadCallback={setButtonPicture} />}
        </ContentBox>
        <ContentBox>
            <form onSubmit={handleSubmit(onSave)}>
                <FormInput type={InputType.Hidden} register={register} name={'id'} />
                <FormInput type={InputType.Hidden} register={register} name={'parentId'} />
                <FormInput type={InputType.Hidden} register={register} name={'order'} />
                <FormTable>
                    <tr>
                        <th>Label</th>
                        <td><FormInput type={InputType.Text} register={register} name={'label'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Parameter</th>
                        <td>
                            <FormInput type={InputType.Text} register={register} name={'path'} errors={errors} />
                        </td>
                        <td>
                            <SelectStyled onChange={e => setParameterFromOptions(e.target.value)}>
                                <option value="" key=""></option>
                                {avatar.parameters?.map(p => (<option value={p.id} key={p.id}>{p.label}</option>))}
                            </SelectStyled>
                        </td>
                    </tr>
                    <tr>
                        <th>Parameter values</th>
                        <td>
                            <FormInput type={InputType.Text} register={register} name={'value'} placeholder={valuePrimaryPlaceholder()} width="130px"
                                       errors={errors} />
                            <FormInput type={InputType.Text} register={register} name={'valueAlt'} placeholder={valueSecondaryPlaceholder()} width="130px"
                                       errors={errors} readOnly={formWatch.buttonType !== ButtonType.Slider && formWatch.buttonType !== ButtonType.Toggle} />
                        </td>
                    </tr>
                    <tr>
                        <th>Value type</th>
                        <td>
                            <FormInput type={InputType.Select} options={enumToInputOptions(ValueType)} register={register} name={'valueType'} errors={errors} />
                        </td>
                    </tr>
                    <tr>
                        <th>Button type</th>
                        <td>
                            <FormInput type={InputType.Select} options={enumToInputOptions(ButtonType)} register={register} name={'buttonType'}
                                       errors={errors} />
                        </td>
                    </tr>
                    <tr>
                        <th>Image orientation</th>
                        <td>
                            <FormInput type={InputType.Select} options={enumToInputOptions(ButtonImageOrientation)} register={register}
                                       name={'imageOrientation'}
                                       errors={errors} readOnly={!button.image} />
                        </td>
                    </tr>
                    <tr>
                        <th>Control parameter</th>
                        <td>
                            <FormInput type={InputType.Select} options={controlParameterOptions()} register={register} name={'controlParameterId'}
                                       errors={errors} />
                        </td>
                    </tr>
                    <tr>
                        <th>Button use cost</th>
                        <td>
                            <FormInput type={InputType.Number} register={register} name={'useCost'}
                                       errors={errors} readOnly={!clientTier.useCost} />
                        </td>
                    </tr>
                </FormTable>
                <FormControlBar>
                    <FormInput type={InputType.Submit} disabled={!isDirty} />
                    <FormInput type={InputType.Button} value="Reset" disabled={!isDirty} onClick={() => reset()} />
                    <FormInput type={InputType.Button} value="Delete" onClick={() => onDelete(button)} />
                    <FormInput type={InputType.Button} value="Cancel" onClick={() => navigate(-1)} />
                </FormControlBar>
            </form>
        </ContentBox>
        <ListenForParameter applyMessage={setFormDataFromOsc} />
    </Content>);
}
