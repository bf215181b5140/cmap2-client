import { Content, ContentBox, ParameterButton } from 'cmap2-shared/dist/react';
import { AvatarDto, ButtonDto, ButtonImageOrientation, ButtonStyleDto, ButtonType, LayoutDto, ParameterRole, ReactProps, TierDto, ValueType } from 'cmap2-shared';
import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AvatarReducerAction } from '../avatars.reducer';
import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { buttonSchema } from 'cmap2-shared/src/zodSchemas';
import FileUpload from '../../../../shared/components/fileUpload.component';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import ListenForParameter from './listenForParameter.component';
import FormTable from '../../../../shared/components/form/formTable.component';
import FormControlBar from '../../../../shared/components/form/formControlBar.component';
import enumToInputOptions from '../../../../shared/util/enumToInputOptions.function';
import { ModalContext } from '../../../../components/mainWindow/mainWindow.componenet';
import SubmitInput from '../../../../shared/components/form/inputs/submit.component';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import HiddenInput from '../../../../shared/components/form/inputs/hidden.component';
import Input from '../../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../../shared/components/form/inputs/select.component';
import NumberInput from '../../../../shared/components/form/inputs/number.component';
import ParameterInput from '../../../../shared/components/form/inputs/parameterInput.component';
import { VrcOscAvatarParameterProperties } from '../../../../../../shared/types/osc';

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
    const customFetch = useCmapFetch();
    const {deleteModal} = useContext(ModalContext);
    const {register, setValue, reset, formState: {errors, isDirty}, watch, handleSubmit} = useForm<ButtonDto>({
        defaultValues: {...button, order: 0, parentId: layout.id},
        resolver: zodResolver(buttonSchema)
    });
    const formWatch = watch();

    function onSave(formData: ButtonDto) {
        function onEdit() {
            avatarDataDispatch({type: 'editButton', button: formData, avatarId: avatar.id, layoutId: layout.id});
            reset({...button, ...formData});
        }

        function onAdd(data: ButtonDto) {
            avatarDataDispatch({type: 'addButton', button: data, avatarId: avatar.id, layoutId: layout.id});
            navigate(-1);
        }

        customFetch<ButtonDto>('button', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        }, formData.id ? onEdit : onAdd);
    }


    function onDelete(button: ButtonDto) {
        customFetch('button', {
            method: 'DELETE',
            body: JSON.stringify(button),
            headers: {'Content-Type': 'application/json'}
        }, () => {
            avatarDataDispatch({type: 'removeButton', button: button, avatarId: avatar.id, layoutId: layout.id});
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

    function setValueTypeFromParameterSelection(param: VrcOscAvatarParameterProperties) {
        setValue('valueType', ValueType[param.type]);
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
            {button.id && formWatch.buttonType !== ButtonType.Slider &&
                <FileUpload parentType="button" parentId={button?.id} uploadCallback={setButtonPicture} />}
        </ContentBox>
        <ContentBox>
            <form onSubmit={handleSubmit(onSave)}>
                <HiddenInput name={'id'} />
                <HiddenInput name={'parentId'} />
                <HiddenInput name={'order'} />
                <FormTable>
                    <tr>
                        <th>Label</th>
                        <td><Input register={register} name={'label'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Parameter</th>
                        <td>
                            <ParameterInput register={register} name={'path'} errors={errors} setValue={setValue} defaultAvatarId={avatar.id} defaultType={'input'}
                                            onSelection={setValueTypeFromParameterSelection} />
                        </td>
                    </tr>
                    <tr>
                        <th>Parameter values</th>
                        <td>
                            <Input register={register} name={'value'} placeholder={valuePrimaryPlaceholder()} width="130px"
                                   errors={errors} />
                            <Input register={register} name={'valueAlt'} placeholder={valueSecondaryPlaceholder()} width="130px"
                                   errors={errors} readOnly={formWatch.buttonType !== ButtonType.Slider && formWatch.buttonType !== ButtonType.Toggle} />
                        </td>
                    </tr>
                    <tr>
                        <th>Value type</th>
                        <td>
                            <SelectInput options={enumToInputOptions(ValueType)} register={register} name={'valueType'} errors={errors} />
                        </td>
                    </tr>
                    <tr>
                        <th>Button type</th>
                        <td>
                            <SelectInput options={enumToInputOptions(ButtonType)} register={register} name={'buttonType'}
                                         errors={errors} />
                        </td>
                    </tr>
                    <tr>
                        <th>Image orientation</th>
                        <td>
                            <SelectInput options={enumToInputOptions(ButtonImageOrientation)} register={register}
                                         name={'imageOrientation'}
                                         errors={errors} readOnly={!button.image} />
                        </td>
                    </tr>
                    <tr>
                        <th>Control parameter</th>
                        <td>
                            <SelectInput options={controlParameterOptions()} register={register} name={'controlParameterId'}
                                         errors={errors} />
                        </td>
                    </tr>
                    <tr>
                        <th>Button use cost</th>
                        <td>
                            <NumberInput register={register} name={'useCost'} errors={errors} readOnly={!clientTier.useCost} />
                        </td>
                    </tr>
                </FormTable>
                <FormControlBar>
                    <SubmitInput disabled={!isDirty} />
                    <ButtonInput text="Reset" disabled={!isDirty} onClick={() => reset()} />
                    <ButtonInput text="Delete" onClick={() => deleteModal('button', () => onDelete(button))} />
                    <ButtonInput text={isDirty ? 'Cancel' : 'Back'} onClick={() => navigate(-1)} />
                </FormControlBar>
            </form>
        </ContentBox>
        <ListenForParameter applyMessage={setFormDataFromOsc} />
    </Content>);
}
