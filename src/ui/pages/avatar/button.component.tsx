import ContentBox from '../../shared/components/contentBox.component';
import { ReactProps } from '../../../shared/global';
import { AvatarDto, ButtonDto, ButtonType, FieldOption, InputType, LayoutDto, ValueType } from 'cmap2-shared';
import Content from '../../shared/components/content.component';
import { useNavigate } from 'react-router-dom';
import ParameterButton from 'cmap2-shared/src/components/parameter.button';
import React, { useEffect } from 'react';
import { AvatarReducerAction } from './avatar.reducer';
import useCustomFetch from '../../shared/hooks/customFetch.hook';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { buttonSchema } from 'cmap2-shared/dist/validationSchemas';
import FormInput from '../../shared/components/form/formInput.component';
import { FormTable, FormControl } from '../../shared/components/form/formTable.component';
import FileUpload from '../../shared/components/fileUpload.component';

interface ButtonComponentProps extends ReactProps {
    button: ButtonDto;
    // order: number;
    layout: LayoutDto;
    avatar: AvatarDto;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function ButtonComponent({button, avatarDataDispatch, avatar, layout, children}: ButtonComponentProps) {

    const navigate = useNavigate();
    const customFetch = useCustomFetch();
    const {register, setValue, formState: {errors}, reset, watch, handleSubmit} = useForm({resolver: zodResolver(buttonSchema)});
    const watchButtonType = watch('buttonType');

    useEffect(() => {
        reset({...button, order: 0, parentId: layout.id});
    }, []);

    function getInputOptions(enumType: any): FieldOption[] {
        return Object.keys(enumType).map((key: string) => ({key: enumType[key], value: key}));
    }

    function onSave(formData: any) {
        customFetch<ButtonDto>('button', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.code === 200) avatarDataDispatch({type: 'editButton', button: formData, avatarId: avatar.id, layoutId: layout.id});
            if (res?.code === 201 && res.body) avatarDataDispatch({type: 'addButton', button: res.body, avatarId: avatar.id, layoutId: layout.id});
            navigate(-1);
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
        avatarDataDispatch({type: 'changeButtonPicture', picture: picture, buttonId: button.id, avatarId: avatar.id, layoutId: layout.id})
    }

    console.log(watchButtonType)

    return (<Content flexDirection="row">
        <ContentBox flexBasis="100%">{avatar.label + ' -> ' + layout.label}</ContentBox>
        <ContentBox flex={1}>
            <h2>Preview</h2>
            <ParameterButton button={button} />
            <br/>
            {button.id && <FileUpload parentType="button" parentId={button?.id} uploadCallback={setButtonPicture} />}
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
                        <td><FormInput type={InputType.Text} register={register} name={'path'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Parameter value</th>
                        <td><FormInput type={InputType.Text} register={register} name={'value'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Secondary value</th>
                        <td><FormInput type={InputType.Text} register={register} name={'valueAlt'} errors={errors} disabled={
                            watchButtonType !== ButtonType.Slider && watchButtonType !== ButtonType.Toggle
                        } /></td>
                    </tr>
                    <tr>
                        <th>Value type</th>
                        <td><FormInput type={InputType.Select} options={getInputOptions(ValueType)} register={register} name={'valueType'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Button type</th>
                        <td><FormInput type={InputType.Select} options={getInputOptions(ButtonType)} register={register} name={'buttonType'} errors={errors} /></td>
                    </tr>
                </FormTable>
                <FormControl>
                    <FormInput type={InputType.Submit} />
                    <FormInput type={InputType.Button} value="Delete" onClick={() => onDelete(button)} />
                    <FormInput type={InputType.Button} value="Cancel" onClick={() => navigate(-1)} />
                </FormControl>
            </form>
        </ContentBox>
    </Content>);
}
