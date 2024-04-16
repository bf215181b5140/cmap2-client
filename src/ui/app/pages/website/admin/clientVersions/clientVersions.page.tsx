import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import React, { useContext, useEffect } from 'react';
import { Content, ContentBox } from 'cmap2-shared/dist/react';
import HiddenInput from '../../../../shared/components/form/inputs/hidden.component';
import { FormTableStyled } from '../../../../shared/components/form/formTable.component';
import Input from '../../../../shared/components/form/inputs/input.component';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import FormControlBar from '../../../../shared/components/form/formControlBar.component';
import SubmitInput from '../../../../shared/components/form/inputs/submit.component';
import { ModalContext } from '../../../../components/mainWindow/mainWindow.componenet';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { ClientVersionDTO, ClientVersionFormDTO, ClientVersionFormSchema } from 'cmap2-shared';
import TextareaInput from '../../../../shared/components/form/inputs/textarea.component';
import DateInput from '../../../../shared/components/form/inputs/date.component';

export default function ClientVersionsPage() {

    const cmapFetch = useCmapFetch();
    const { deleteModal } = useContext(ModalContext);
    const { register, control, handleSubmit, watch, reset, formState: { errors, isDirty } } = useForm<ClientVersionFormDTO>({
        defaultValues: { versions: [] },
        resolver: zodResolver(ClientVersionFormSchema)
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'versions' });
    const watchClientVersions = watch('versions')!;

    useEffect(() => {
        cmapFetch<ClientVersionDTO[]>('clientVersions', {}, data => {
            reset({ versions: data });
        });
    }, []);

    function onSubmit(formData: ClientVersionFormDTO) {
        cmapFetch<ClientVersionDTO[]>('clientVersions', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        }, (data) => {
            reset({ versions: data });
        });
    }

    function onDelete(index: number) {
        if (!watchClientVersions) return;
        const version = watchClientVersions[index];
        if (version.id) {
            cmapFetch('clientVersions', {
                method: 'DELETE',
                body: JSON.stringify(version),
                headers: { 'Content-Type': 'application/json' }
            }, () => {
                reset({ versions: watchClientVersions.filter(v => v.id !== version.id!) });
            });
        } else {
            remove(index);
        }
    }

    return (<Content>
        <ContentBox>
            <h2>Client versions</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTableStyled>
                    <thead>
                    {watchClientVersions && watchClientVersions.length > 0 &&
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
                                <ButtonInput text="Delete" onClick={() => deleteModal('client version', () => onDelete(index))} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </FormTableStyled>
                <hr />
                <FormControlBar>
                    <ButtonInput text="Add new" onClick={() => append({
                        id: null,
                        version: '',
                        download: '',
                        description: '',
                        date: new Date(),
                    })} />
                    <SubmitInput disabled={!isDirty} />
                    <ButtonInput text="Reset" disabled={!isDirty} onClick={() => reset()} />
                </FormControlBar>
            </form>
        </ContentBox>
    </Content>);
}

