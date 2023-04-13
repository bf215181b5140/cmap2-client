import ContentBox from '../../components/contentBox.component';
import { ReactProps } from '../../../shared/global';
import { AvatarDto, ButtonDto, ButtonType, FieldOption, InputType, LayoutDto, ValueType } from 'cmap2-shared';
import Content from '../../components/content.component';
import { useNavigate } from 'react-router-dom';
import ParameterButton from '../../components/buttons/parameter.button';
import React, { useEffect } from 'react';
import { AvatarReducerAction } from './avatar.reducer';
import useCustomFetch from '../../hooks/customFetch.hook';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { buttonSchema } from 'cmap2-shared/dist/validationSchemas';
import FormInput from '../../components/form/formInput.component';
import { FormTable, FormControl } from '../../components/form/formTable.component';

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
    const {register, setValue, formState: {errors}, reset, handleSubmit} = useForm({resolver: zodResolver(buttonSchema)});

    useEffect(() => {
        setValue('id', button.id ? button.id : null);
        setValue('parentId', layout.id);
        setValue('order', 0); // todo
        setValue('label', button.label);
        setValue('path', button.path);
        setValue('value', button.value);
        setValue('valueType', button.valueType);
        setValue('buttonType', button.buttonType);
        setValue('image', button.image);
    }, []);

    function getOptions(enumType: any): FieldOption[] {
        return Object.keys(enumType).map((key: string) => ({key: enumType[key], value: key}));
    }

    function onSave(formData: any) {
        customFetch<ButtonDto>('button', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData)
        }).then(res => {
            if (res?.code === 200) avatarDataDispatch({type: 'editButton', button: formData, avatarId: avatar.id, layoutId: layout.id});
            if (res?.code === 201 && res.body) avatarDataDispatch({type: 'addButton', button: res.body, avatarId: avatar.id, layoutId: layout.id});
            navigate(-1);
        });
    }

    function onDelete(button: ButtonDto) {
        customFetch('button', {
            method: 'DELETE',
            body: JSON.stringify(button)
        }).then(res => {
            if (res?.code === 200) avatarDataDispatch({type: 'removeButton', button: button, avatarId: avatar.id, layoutId: layout.id});
            navigate(-1);
        });
    }

    return (<Content flexDirection="row">
        <ContentBox flexBasis="100%">{avatar.label + ' -> ' + layout.label}</ContentBox>
        <ContentBox flex={1}>
            <h1>Preview</h1>
            <ParameterButton button={button} />
            <p>use it to test it ingame</p>
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
                        <th>Value type</th>
                        <td><FormInput type={InputType.Select} options={getOptions(ValueType)} register={register} name={'valueType'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Button type</th>
                        <td><FormInput type={InputType.Select} options={getOptions(ButtonType)} register={register} name={'buttonType'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>image</th>
                        <td><FormInput type={InputType.File} register={register} name={'image'} errors={errors} /></td>
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
