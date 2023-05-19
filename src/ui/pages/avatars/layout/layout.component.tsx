import ContentBox from '../../../shared/components/contentBox.component';
import { AvatarDto, ButtonDto, LayoutDto, ReactProps, TierDto } from 'cmap2-shared';
import ParameterButton from 'cmap2-shared/src/components/parameter.button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../../shared/components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import React, { useEffect, useState } from 'react';
import { layoutSchema } from 'cmap2-shared/dist/validationSchemas';
import styled from 'styled-components';
import useCustomFetch from '../../../shared/hooks/customFetch.hook';
import { AvatarReducerAction } from '../avatars.reducer';
import FormTable from '../../../shared/components/form/formTable.component';
import { ButtonStyleDto } from 'cmap2-shared/src';
import addNewButton from './addNew.button';
import AddNewButton from './addNew.button';

interface LayoutComponentProps extends ReactProps {
    layout: LayoutDto;
    order: number;
    avatar: AvatarDto;
    clientTier: TierDto;
    buttonStyle: ButtonStyleDto;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function LayoutComponent({layout, order, avatar, avatarDataDispatch, clientTier, buttonStyle}: LayoutComponentProps) {

    const navigate = useNavigate();
    const customFetch = useCustomFetch();
    const {register, formState: {errors, isDirty}, reset, handleSubmit} = useForm({
        defaultValues: {
            id: layout.id,
            label: layout.label,
            order: order,
            parentId: avatar.id
        }, resolver: zodResolver(layoutSchema)
    });
    const [inEdit, setEditing] = useState<boolean>(false);

    useEffect(() => {
        reset();
    }, [avatar]);

    function onSave(formData: any) {
        customFetch<LayoutDto>('layout', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.code === 200) {
                avatarDataDispatch({type: 'editLayout', layout: formData, avatarId: avatar.id});
                reset({
                    id: formData.id,
                    label: formData.label,
                    order: order,
                    parentId: formData.id
                });
            }
            if (res?.code === 201 && res.body) avatarDataDispatch({type: 'addLayout', layout: res.body, avatarId: avatar.id});
            setEditing(false);
        });
    }

    function onDelete(layout: LayoutDto) {
        customFetch('layout', {
            method: 'DELETE',
            body: JSON.stringify(layout),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.code === 200) avatarDataDispatch({type: 'removeLayout', layout: layout, avatarId: avatar.id});
        });
    }

    return (<ContentBox>
        {!inEdit && <FormTable width="100%">
            <tr>
                <td>{layout.id && <LayoutLabel>{layout.label}</LayoutLabel>}</td>
                <td style={{textAlign: 'right'}}><FormInput type={InputType.Button} value={layout.id ? 'Edit' : 'Add new'}
                                                            onClick={() => setEditing(true)} /></td>
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
                        <FormInput type={InputType.Submit} disabled={!isDirty} />
                        {layout.id && <FormInput type={InputType.Button} value={'Delete'} onClick={() => onDelete(layout)} />}
                        <FormInput type={InputType.Button} value={'Cancel'} onClick={() => {
                            reset({
                                id: layout.id,
                                label: layout.label,
                                order: order,
                                parentId: avatar.id
                            });
                            setEditing(false);
                        }} />
                    </td>
                </tr>
            </FormTable>
        </form>}
        {layout.id && <hr />}
        {layout.id && <ButtonsBox>
            {layout.buttons?.map((button: ButtonDto) => (
                <ParameterButton button={button} key={button.id} flexBasis="calc(25% - (3 * 15px / 4))" buttonStyle={buttonStyle}
                                 onClick={() => navigate('/avatars/' + avatar.id + '/' + layout.id + '/' + button.id)} />
            ))}
            {(clientTier.buttons && (!layout.buttons || layout.buttons.length < clientTier.buttons)) &&
                <AddNewButton onClick={() => navigate('/avatars/' + avatar.id + '/' + layout.id + '/new')} />}
        </ButtonsBox>}
    </ContentBox>);
}

const LayoutLabel = styled.h2`
  margin: 7px;
  font-size: 20px;
  display: inline-block;
`;

const ButtonsBox = styled.div`
  column-width: 160px;
  column-fill: balance;
  gap: 15px;

  text-align: center;

  margin: 0;
  padding: 0;
  
  > div {
    margin-bottom: 15px;
    //display: inline-flex;
    //flex-direction: column;
    //width: 100%;
    //min-width: 160px;
    //max-width: 230px;
    //margin: 0;
    //padding: 0;
  }
`;
