import { LayoutDTO, LayoutFormSchema, LayoutWidth, ReactProps } from 'cmap2-shared';
import React, { useContext, useEffect, useState } from 'react';
import { AvatarReducerAction } from '../../../avatars.reducer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import useCmapFetch from '../../../../../../shared/hooks/cmapFetch.hook';
import FormTable from '../../../../../../shared/components/form/formTable.component';
import FormControlBar from '../../../../../../shared/components/form/formControlBar.component';
import enumToInputOptions from '../../../../../../shared/util/enumToInputOptions.function';
import { ModalContext } from '../../../../../../components/mainWindow/mainWindow.componenet';
import SubmitInput from '../../../../../../shared/components/form/inputs/submit.component';
import HiddenInput from '../../../../../../shared/components/form/inputs/hidden.component';
import ButtonInput from '../../../../../../shared/components/form/inputs/button.component';
import SelectInput from '../../../../../../shared/components/form/inputs/select.component';
import Input from '../../../../../../shared/components/form/inputs/input.component';

interface LayoutFormComponentProps extends ReactProps {
    layout: LayoutDTO;
    order: number;
    avatarId: string;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function LayoutFormComponent({layout, order, avatarId, avatarDataDispatch}: LayoutFormComponentProps) {

    const {deleteModal} = useContext(ModalContext);
    const {register, formState: {errors, isDirty}, reset, handleSubmit} = useForm({
        defaultValues: {
            id: layout.id,
            label: layout.label,
            order: order,
            width: layout.width,
            parentId: avatarId
        }, resolver: zodResolver(LayoutFormSchema)
    });
    const [inEdit, setEditing] = useState<boolean>(!layout.id);
    const customFetch = useCmapFetch();

    useEffect(() => {
        reset();
    }, [avatarId]);

    function onSave(formData: any) {
        customFetch<LayoutDTO>('layout', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        },  (data, res) => {
            if (res.code === 201) {
                avatarDataDispatch({type: 'addLayout', layout: data, avatarId: avatarId});
                setEditing(false);
            } else {
                avatarDataDispatch({type: 'editLayout', layout: formData, avatarId: avatarId});
                reset({
                    id: formData.id,
                    label: formData.label,
                    order: order,
                    parentId: formData.id
                });
            }
        });
    }

    function onDelete(layout: LayoutDTO) {
        customFetch('layout', {
            method: 'DELETE',
            body: JSON.stringify(layout),
            headers: {'Content-Type': 'application/json'}
        }, () => {
            avatarDataDispatch({type: 'removeLayout', layout: layout, avatarId: avatarId});
        });
    }

    return (<>
        {!inEdit &&
            <FormControlBar>
                <ButtonInput text={'Edit'} onClick={() => setEditing(true)} />
            </FormControlBar>}
        {inEdit &&
            <form onSubmit={handleSubmit(onSave)}>
                <HiddenInput register={register} name={'id'} />
                <HiddenInput register={register} name={'parentId'} />
                <HiddenInput register={register} name={'order'} />
                <FormTable>
                    <tr>
                        <th>Label</th>
                        <td>
                            <Input register={register} name={'label'} errors={errors} />
                        </td>
                    </tr>
                    <tr>
                        <th>Minimum width</th>
                        <td>
                            <SelectInput options={enumToInputOptions(LayoutWidth)} register={register} name={'width'}
                                         errors={errors} />
                        </td>
                    </tr>
                </FormTable>
                <FormControlBar>
                    <SubmitInput text={layout.id ? 'Save' : 'Add new'} disabled={!isDirty} />
                    {layout.id &&
                        <>
                            <ButtonInput text="Reset" disabled={!isDirty} onClick={() => reset()} />
                            <ButtonInput text="Delete" onClick={() => deleteModal('layout', () => onDelete(layout))} />
                            <ButtonInput text="Cancel" onClick={() => {
                                reset();
                                setEditing(false);
                            }} />
                        </>
                    }
                </FormControlBar>
            </form>}
        {layout.id && <hr />}
    </>);

}

