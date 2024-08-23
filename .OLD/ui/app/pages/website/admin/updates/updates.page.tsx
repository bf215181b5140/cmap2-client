import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import React, { useContext, useEffect } from 'react';
import HiddenInput from '../../../../shared/components/form/inputs/hidden.component';
import { FormTableStyled } from '../../../../shared/components/form/formTable.component';
import Input from '../../../../shared/components/form/inputs/input.component';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import FormControlBar from '../../../../shared/components/form/formControlBar.component';
import { ModalContext } from '../../../../components/mainWindow/mainWindow.componenet';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { UpdateDTO, UpdatesFormDTO, UpdatesFormSchema } from 'cmap2-shared';
import TextareaInput from '../../../../shared/components/form/inputs/textarea.component';
import DateInput from '../../../../shared/components/form/inputs/date.component';
import IconButton from '../../../../shared/components/buttons/iconButton.component';
import Content from '../../../../shared/components/contentBox/content.component';
import ContentBox from '../../../../shared/components/contentBox/contentBox.component';

export default function UpdatesPage() {

    const cmapFetch = useCmapFetch();
    const { register, control, handleSubmit, watch, reset, formState: { errors, isDirty } } = useForm<UpdatesFormDTO>({
        defaultValues: { versions: [] },
        resolver: zodResolver(UpdatesFormSchema)
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'versions' });
    const watchVersions = watch('versions')!;

    useEffect(() => {
        cmapFetch<UpdateDTO[]>('admin/updates', {}, data => {
            reset({ versions: data });
        });
    }, []);

    function onSubmit(formData: UpdatesFormDTO) {
        cmapFetch<UpdateDTO[]>('admin/updates', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        }, (data) => {
            reset({ versions: data });
        });
    }

    function onDelete(index: number) {
        if (!watchVersions) return;
        const version = watchVersions[index];
        if (version.id) {
            cmapFetch('admin/updates', {
                method: 'DELETE',
                body: JSON.stringify(version),
                headers: { 'Content-Type': 'application/json' }
            }, () => {
                reset({ versions: watchVersions.filter(v => v.id !== version.id!) });
            });
        } else {
            remove(index);
        }
    }

    return (<Content>
        <ContentBox contentTitle={'Updates'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTableStyled>
                    <thead>
                    {watchVersions && watchVersions.length > 0 &&
                        <tr>
                            <th>Version</th>
                            <th>Download link</th>
                            <th>Description</th>
                            <td></td>
                        </tr>
                    }
                    </thead>
                    <tbody>
                    {fields.map((item, index) => (
                        <tr key={item.id}>
                            <td>
                                <HiddenInput register={register} name={`versions.${index}.id`} />
                                <Input register={register} name={`versions.${index}.version`} width={'85px'} errors={errors} />
                            </td>
                            <td>
                                <Input register={register} name={`versions.${index}.download`} errors={errors} />
                            </td>
                            <td>
                                <TextareaInput register={register} name={`versions.${index}.description`} errors={errors} />
                            </td>
                            <td>
                                <DateInput type={'datetime-local'} control={control} name={`versions.${index}.date`} errors={errors} />
                            </td>
                            <td>
                                <IconButton role={'delete'} deleteKeyword={'update'} size={'small'} onClick={() => onDelete(index)} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </FormTableStyled>
                <hr />
                <FormControlBar>
                    <IconButton role={'add'} size={'small'} onClick={() => append({
                        id: null,
                        version: '',
                        download: '',
                        description: '',
                        date: new Date(),
                    })} />
                    <hr />
                    <IconButton role={'save'} disabled={!isDirty} />
                    <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
                </FormControlBar>
            </form>
        </ContentBox>
    </Content>);
}

