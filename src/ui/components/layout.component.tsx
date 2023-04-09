import ContentBox from '../components/contentBox.component';
import { ReactProps } from '@/shared/global';
import { AvatarDto, ButtonDto, LayoutDto } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import React, { useCallback, useEffect, useState } from 'react';
import { layoutSchema } from 'cmap2-shared/dist/validationSchemas';
import styled from 'styled-components';
import ParameterButton from './buttons/parameter.button';
import useCustomFetch from '../hooks/customFetch.hook';
import { AvatarReducerAction } from '../pages/avatar/avatar.reducer';

interface LayoutComponentProps extends ReactProps {
    layout: LayoutDto;
    order: number;
    avatar: AvatarDto;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function LayoutComponent({layout, order, avatar, avatarDataDispatch, children}: LayoutComponentProps) {

    const navigate = useNavigate();
    const customFetch = useCustomFetch();
    const {register, formState: {errors}, reset, handleSubmit} = useForm({resolver: zodResolver(layoutSchema)});
    const [inEdit, setEditing] = useState<boolean>(false);

    const resetForm = useCallback(() => {
        reset({
            id: layout.id,
            label: layout.label,
            order: order,
            parentId: avatar.id
        });
    }, []);

    useEffect(() => {
        resetForm();
    }, []);

    function onSave(formData: any) {
        customFetch('layout', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData)
        }).then(res => {
            if (res?.code === 200) avatarDataDispatch({type: 'editLayout', layout: formData, avatarId: avatar.id});
            if (res?.code === 201) avatarDataDispatch({type: 'addLayout', layout: res.body, avatarId: avatar.id});
        });
    }

    function onDelete(layout: LayoutDto) {
        customFetch('layout', {
            method: 'DELETE',
            body: JSON.stringify(layout.id)
        }).then(res => {
            if (res?.code === 200) avatarDataDispatch({type: 'removeLayout', layout: layout, avatarId: avatar.id});
        });
    }

    return (<ContentBox>
        {!inEdit && <>
            {layout.id && <LayoutLabel>{layout.label}</LayoutLabel>}
            <FormInput type={InputType.Button} value={layout.id ? 'Edit' : 'Add new'} onClick={() => setEditing(true)}></FormInput>
        </>}
        {inEdit && <form onSubmit={handleSubmit(onSave)}>
            <FormInput type={InputType.Hidden} register={register} name={'id'} />
            <FormInput type={InputType.Hidden} register={register} name={'parentId'} />
            <FormInput type={InputType.Hidden} register={register} name={'order'} />
            <FormInput type={InputType.Text} register={register} name={'label'} errors={errors} />
            <FormInput type={InputType.Submit} />
            {layout.id && <FormInput type={InputType.Button} value={'Delete'} onClick={() => onDelete(layout)}></FormInput>}
            <FormInput type={InputType.Button} value={'Cancel'} onClick={() => {
                resetForm();
                setEditing(false);
            }}></FormInput>
            <p>{errors?.id?.message?.toString()}</p>
        </form>}
        <hr />
        <ButtonsBox>
            {layout.buttons?.map((button: ButtonDto) => (
                <ParameterButton button={button} key={button.id} flexBasis="calc(25% - (3 * 15px / 4))"
                                 onClick={() => navigate('/avatar/' + avatar.id + '/' + layout.id + '/' + button.id)} />
            ))}
        </ButtonsBox>
    </ContentBox>);
}

const LayoutLabel = styled.h2`
  margin: 7px;
  font-size: 20px;
  display: inline-block;
`;

const ButtonsBox = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
`;
