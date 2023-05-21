import { ContentBoxWidth, InputType, LayoutDto, ReactProps } from 'cmap2-shared';
import React, { useEffect, useState } from 'react';
import { AvatarReducerAction } from '../../../avatars.reducer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { layoutSchema } from 'cmap2-shared/src/zodSchemas';
import useCustomFetch from '../../../../../shared/hooks/customFetch.hook';
import FormTable from '../../../../../shared/components/form/formTable.component';
import FormInput from '../../../../../shared/components/form/formInput.component';
import FormControlBar from '../../../../../shared/components/form/formControlBar.component';
import enumToInputOptions from '../../../../../shared/util/enumToInputOptions.function';

interface LayoutFormComponentProps extends ReactProps {
    layout: LayoutDto;
    order: number;
    avatarId: string;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function LayoutFormComponent({layout, order, avatarId, avatarDataDispatch}: LayoutFormComponentProps) {

    const {register, formState: {errors, isDirty}, reset, handleSubmit} = useForm({
        defaultValues: {
            id: layout.id,
            label: layout.label,
            order: order,
            parentId: avatarId
        }, resolver: zodResolver(layoutSchema)
    });
    const [inEdit, setEditing] = useState<boolean>(false);
    const customFetch = useCustomFetch();

    useEffect(() => {
        reset();
    }, [avatarId]);

    function onSave(formData: any) {
        customFetch<LayoutDto>('layout', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.code === 200) {
                avatarDataDispatch({type: 'editLayout', layout: formData, avatarId: avatarId});
                reset({
                    id: formData.id,
                    label: formData.label,
                    order: order,
                    parentId: formData.id
                });
            }
            if (res?.code === 201 && res.body) avatarDataDispatch({type: 'addLayout', layout: res.body, avatarId: avatarId});
            setEditing(false);
        });
    }

    function onDelete(layout: LayoutDto) {
        customFetch('layout', {
            method: 'DELETE',
            body: JSON.stringify(layout),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.code === 200) avatarDataDispatch({type: 'removeLayout', layout: layout, avatarId: avatarId});
        });
    }

    return (<>
        {!inEdit &&
            <FormControlBar>
                <FormInput type={InputType.Button} value={'Edit'} onClick={() => setEditing(true)} />
            </FormControlBar>}
        {inEdit &&
            <form onSubmit={handleSubmit(onSave)}>
                <FormInput type={InputType.Hidden} register={register} name={'id'} />
                <FormInput type={InputType.Hidden} register={register} name={'parentId'} />
                <FormInput type={InputType.Hidden} register={register} name={'order'} />
                <FormTable>
                    <tr>
                        <th>Label</th>
                        <td>
                            <FormInput type={InputType.Text} register={register} name={'label'} errors={errors} />
                        </td>
                    </tr>
                    <tr>
                        <th>Minimum width</th>
                        <td>
                            <FormInput type={InputType.Select} options={enumToInputOptions(ContentBoxWidth)} register={register} name={'width'}
                                       errors={errors} />
                        </td>
                    </tr>
                </FormTable>
                <FormControlBar>
                    <FormInput type={InputType.Submit} value={layout.id ? 'Save' : 'Add new'} disabled={!isDirty} />
                    <FormInput type={InputType.Button} value={'Reset'} disabled={!isDirty} onClick={() => reset()} />
                    {layout.id && <FormInput type={InputType.Button} value={'Delete'} onClick={() => onDelete(layout)} />}
                    <FormInput type={InputType.Button} value={'Cancel'} onClick={() => {
                        reset();
                        setEditing(false);
                    }} />
                </FormControlBar>
            </form>}
        {layout.id && <hr />}
    </>);

}

