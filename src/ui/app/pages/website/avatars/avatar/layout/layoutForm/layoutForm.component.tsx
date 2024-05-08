import { LayoutDTO, LayoutFormSchema, LayoutWidth, ReactProps } from 'cmap2-shared';
import React, { useEffect } from 'react';
import { AvatarReducerAction } from '../../../avatars.reducer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import useCmapFetch from '../../../../../../shared/hooks/cmapFetch.hook';
import FormTable from '../../../../../../shared/components/form/formTable.component';
import FormControlBar from '../../../../../../shared/components/form/formControlBar.component';
import enumToInputOptions from '../../../../../../shared/util/enumToInputOptions.function';
import HiddenInput from '../../../../../../shared/components/form/inputs/hidden.component';
import SelectInput from '../../../../../../shared/components/form/inputs/select.component';
import Input from '../../../../../../shared/components/form/inputs/input.component';
import { InteractionKeyDTO } from 'cmap2-shared/dist/types/InteractionKey';
import { LayoutFormDTO } from 'cmap2-shared/src/types/layout';
import IconButton from '../../../../../../shared/components/buttons/iconButton.component';

interface LayoutFormComponentProps extends ReactProps {
    layout: LayoutDTO;
    order: number;
    avatarId: string;
    interactionKeys: InteractionKeyDTO[];
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function LayoutFormComponent({ layout, order, avatarId, interactionKeys, avatarDataDispatch }: LayoutFormComponentProps) {

    const { register, formState: { errors, isDirty }, reset, handleSubmit } = useForm<LayoutFormDTO>({
        defaultValues: {
            id: layout.id,
            parentId: avatarId,
            order: order,
            label: layout.label,
            width: layout.width,
            interactionKeyId: layout.interactionKey?.id || '',
        }, resolver: zodResolver(LayoutFormSchema)
    });
    const customFetch = useCmapFetch();

    useEffect(() => {
        reset({
            id: layout.id,
            parentId: avatarId,
            order: order,
            label: layout.label,
            width: layout.width,
            interactionKeyId: layout.interactionKey?.id || '',
        });
    }, [avatarId]);

    function onSave(formData: LayoutFormDTO) {
        customFetch<LayoutDTO>('layout', {
            method: formData.id ? 'POST' : 'PUT',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        }, (data, res) => {
            if (res.code === 201) {
                avatarDataDispatch({ type: 'addLayout', layout: data, avatarId: avatarId });
                reset();
            } else {
                avatarDataDispatch({ type: 'editLayout', layout: data, avatarId: avatarId });
                reset({
                    id: data.id,
                    parentId: avatarId,
                    order: data.order,
                    label: data.label,
                    width: data.width,
                    interactionKeyId: data.interactionKey?.id || '',
                });
            }
        });
    }

    function onDelete(layout: LayoutDTO) {
        customFetch('layout', {
            method: 'DELETE',
            body: JSON.stringify(layout),
            headers: { 'Content-Type': 'application/json' }
        }, () => {
            avatarDataDispatch({ type: 'removeLayout', layout: layout, avatarId: avatarId });
        });
    }

    return (<form onSubmit={handleSubmit(onSave)}>
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
                    <tr>
                        <th>Interaction key</th>
                        <td>
                            <SelectInput options={[{ key: '', value: '' }, ...interactionKeys.map(k => ({ key: k.id!, value: k.label }))]}
                                         register={register} name={'interactionKeyId'} errors={errors} />
                        </td>
                    </tr>
                </FormTable>
                <FormControlBar>
                    <IconButton style={'save'} tooltip={layout.id ? 'Save' : 'Save new layout'} disabled={!isDirty} />
                    {layout.id &&
                        <>
                            <IconButton style={'reset'} disabled={!isDirty} onClick={() => reset()} />
                            <hr />
                            <IconButton style={'delete'} deleteKeyword={'layout'} size={'small'} onClick={() => onDelete(layout)} />
                            {/* <ButtonInput text="Cancel" onClick={() => { */}
                            {/*     reset(); */}
                            {/*     setEditing(false); */}
                            {/* }} /> */}
                        </>
                    }
                </FormControlBar>
            </form>);

}

