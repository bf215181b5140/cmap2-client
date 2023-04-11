import ContentBox from '../../components/contentBox.component';
import { ReactProps } from '../../../shared/global';
import { AvatarDto, ButtonDto, LayoutDto, TierDto } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import React, { useEffect, useState } from 'react';
import { layoutSchema } from 'cmap2-shared/dist/validationSchemas';
import styled from 'styled-components';
import ParameterButton from '../../components/buttons/parameter.button';
import useCustomFetch from '../../hooks/customFetch.hook';
import { AvatarReducerAction } from './avatar.reducer';
import { FormTable } from '../../components/form/formTable.component';

interface LayoutComponentProps extends ReactProps {
    layout: LayoutDto;
    order: number;
    avatar: AvatarDto;
    clientTier: TierDto;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function LayoutComponent({layout, order, avatar, avatarDataDispatch, clientTier}: LayoutComponentProps) {

    const navigate = useNavigate();
    const customFetch = useCustomFetch();
    const {register, formState: {errors}, reset, handleSubmit} = useForm({resolver: zodResolver(layoutSchema)});
    const [inEdit, setEditing] = useState<boolean>(false);

    function resetForm() {
        reset({
            id: layout.id,
            label: layout.label,
            order: order,
            parentId: avatar.id
        });
    }

    useEffect(() => {
        resetForm();
    }, []);

    function onSave(formData: any) {
        customFetch<LayoutDto>('layout', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData)
        }).then(res => {
            console.log('onSave res');
            if (res?.code === 200) avatarDataDispatch({type: 'editLayout', layout: formData, avatarId: avatar.id});
            if (res?.code === 201 && res.body) avatarDataDispatch({type: 'addLayout', layout: res.body, avatarId: avatar.id});
            setEditing(false);
        });
    }

    function onDelete(layout: LayoutDto) {
        customFetch('layout', {
            method: 'DELETE',
            body: JSON.stringify(layout)
        }).then(res => {
            console.log('onDelete', res)
            if (res?.code === 200) avatarDataDispatch({type: 'removeLayout', layout: layout, avatarId: avatar.id});
        });
    }

    return (<ContentBox>
        {!inEdit && <FormTable width="100%">
            <tr>
                <td>{layout.id && <LayoutLabel>{layout.label}</LayoutLabel>}</td>
                <td style={{textAlign: 'right'}}><FormInput type={InputType.Button} value={layout.id ? 'Edit' : 'Add new'}
                                                            onClick={() => setEditing(true)}></FormInput></td>
            </tr>
        </FormTable>}
        {inEdit && <form onSubmit={handleSubmit(onSave)}>
            <FormInput type={InputType.Hidden} register={register} name={'id'} />
            <FormInput type={InputType.Hidden} register={register} name={'parentId'} />
            <FormInput type={InputType.Hidden} register={register} name={'order'} />
            <FormTable width="100%">
                <tr>
                    <td><FormInput type={InputType.Text} register={register} name={'label'} errors={errors} /></td>
                    <td style={{textAlign: 'right'}}>
                        <FormInput type={InputType.Submit} />
                        {layout.id && <FormInput type={InputType.Button} value={'Delete'} onClick={() => onDelete(layout)}></FormInput>}
                        <FormInput type={InputType.Button} value={'Cancel'} onClick={() => {
                            resetForm();
                            setEditing(false);
                        }} />
                    </td>
                </tr>
            </FormTable>
        </form>}
        {layout.id && <hr />}
        {layout.id && <ButtonsBox>
            {layout.buttons?.map((button: ButtonDto) => (
                <ParameterButton button={button} key={button.id} flexBasis="calc(25% - (3 * 15px / 4))"
                                 onClick={() => navigate('/avatar/' + avatar.id + '/' + layout.id + '/' + button.id)} />
            ))}
            {layout.buttons.length < clientTier.buttons && <ParameterButton button={new ButtonDto()} key={'new'} flexBasis="calc(25% - (3 * 15px / 4))"
                              onClick={() => navigate('/avatar/' + avatar.id + '/' + layout.id + '/new')} />}
        </ButtonsBox>}
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
