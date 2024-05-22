import { InteractionKeyDTO, InteractionKeyFormDTO, InteractionKeyFormSchema } from 'cmap2-shared/dist/types/InteractionKey';
import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import React, { useContext } from 'react';
import { ModalContext } from '../../../../components/mainWindow/mainWindow.componenet';
import { useFieldArray, useForm } from 'react-hook-form';
import { ClientDTO } from 'cmap2-shared';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { ContentBoxWidth } from 'cmap2-shared/src';
import HiddenInput from '../../../../shared/components/form/inputs/hidden.component';
import { FormTableStyled } from '../../../../shared/components/form/formTable.component';
import Input from '../../../../shared/components/form/inputs/input.component';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import FormControlBar from '../../../../shared/components/form/formControlBar.component';
import SubmitInput from '../../../../shared/components/form/inputs/submit.component';
import ContentBox from '../../../../shared/components/contentBox/contentBox.component';
import IconButton from '../../../../shared/components/buttons/iconButton.component';

interface InteractionKeysProps {
    client: ClientDTO;
    interactionKeys: InteractionKeyDTO[];
    setInteractionKeys: (interactionKeys: InteractionKeyDTO[]) => void;
}

export default function InteractionKeys({ client, interactionKeys, setInteractionKeys }: InteractionKeysProps) {

    const cmapFetch = useCmapFetch();
    const { deleteModal } = useContext(ModalContext);
    const { register, control, handleSubmit, watch, reset, formState: { errors, isDirty } } = useForm<InteractionKeyFormDTO>({
        defaultValues: {
            clientId: client.id, interactionKeys: interactionKeys || []
        }, resolver: zodResolver(InteractionKeyFormSchema)
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'interactionKeys' });
    const watchInteractionKeys = watch('interactionKeys')!;

    function onSubmit(formData: InteractionKeyFormDTO) {
        cmapFetch<InteractionKeyDTO[]>('interactionKeys', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        }, (data) => {
            setInteractionKeys(data);
            reset({ clientId: client.id, interactionKeys: data });
        });
    }

    function onDelete(index: number) {
        if (!watchInteractionKeys) return;
        const key = watchInteractionKeys[index];
        if (key.id) {
            cmapFetch('interactionKeys', {
                method: 'DELETE',
                body: JSON.stringify(key),
                headers: { 'Content-Type': 'application/json' }
            }, () => {
                const filteredKeys = interactionKeys.filter(k => k.id !== key.id!);
                setInteractionKeys(filteredKeys);
                reset({ clientId: client.id, interactionKeys: filteredKeys });
            });
        } else {
            remove(index);
        }
    }

    return (<ContentBox contentTitle={'Interaction keys'} infoContent={InteractionKeysInfo()} flexBasis={ContentBoxWidth.Full}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <HiddenInput register={register} name={'clientId'} />
            <FormTableStyled>
                <thead>
                {watchInteractionKeys && watchInteractionKeys.length > 0 &&
                    <tr>
                        <th>Label</th>
                        <th>Key</th>
                        <td></td>
                    </tr>
                }
                </thead>
                <tbody>
                {fields.map((item, index) => (
                    <tr key={index}>
                        <td>
                            <HiddenInput register={register} name={`interactionKeys.${index}.id`} />
                            <Input register={register} name={`interactionKeys.${index}.label`} errors={errors} />
                        </td>
                        <td>
                            <Input register={register} name={`interactionKeys.${index}.key`} errors={errors} />
                        </td>
                        <td>
                            <ButtonInput text="Delete" onClick={() => deleteModal('interaction key', () => onDelete(index))} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </FormTableStyled>
            <hr />
            <FormControlBar>
                <IconButton role={'add'} size={'small'} disabled={watchInteractionKeys.length >= Math.min(16, client.tier.interactionKeys)} onClick={() => append({
                    id: null,
                    label: '',
                    key: '',
                })} />
                <hr />
                <IconButton role={'save'} disabled={!isDirty} />
                <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}

function InteractionKeysInfo() {
    return (<>
        <p>
            Interaction keys allow you to lock individual layout or button behind keys.
            <br />
            Create a new key here, then when editing layout/button you can select it and that layout/button will only be visible to website users who enter the key.
        </p>
    </>);
}
