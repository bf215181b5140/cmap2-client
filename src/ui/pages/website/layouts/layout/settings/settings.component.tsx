import Segment from '../../../../../components/segment/segment.component';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { useForm, useFieldArray } from 'react-hook-form';
import { LayoutDTO, LayoutFormDTO, LayoutFormSchema, TierDTO } from 'cmap2-shared';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../../components/form/formTable.component';
import Input from '../../../../../components/input/input.component';
import FormControlBar from '../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../components/buttons/iconButton.component';
import React from 'react';
import CheckboxInput from '../../../../../components/input/checkbox.component';
import NumberInput from '../../../../../components/input/number.component';
import AddCounter from '../../../../../components/addCounter/addCounter.component';

interface LayoutSettingsProps {
    layout: LayoutDTO;
    tier: TierDTO;
}

export default function LayoutSettings({ layout, tier }: LayoutSettingsProps) {

    const { POST, PUT } = useCmapFetch();
    const { register, control, setValue, handleSubmit, watch, reset, formState: { errors, isDirty } } = useForm<LayoutFormDTO>({
        resolver: zodResolver(LayoutFormSchema),
        defaultValues: layout,
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'avatars' });

    const canAddAvatars = fields.length < tier.avatars;

    function onSubmit(formData: LayoutFormDTO) {
        if (layout.id) {
            POST(`layouts/layout/${layout.id}`, formData, undefined, () => {
                reset(formData);
            });
        } else {
            PUT(`layouts/layout`, formData, undefined, () => {
                reset(formData);
            });
        }
    };

    return (<Segment segmentTitle={'Settings'}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormTable>
                <tr>
                    <th>Label</th>
                    <td><Input register={register} name={'label'} errors={errors} width={'350px'} /></td>
                </tr>
            </FormTable>
                <fieldset>
                    <legend>Avatars</legend>
                    <p>When using an avatar that isn't set on any layout you can display a specific default layout.</p>
                    <FormTable>
                        {fields.map((item, index) => (<tr key={index}>
                            {index === 0 && <th rowSpan={fields.length}>Avatar ID</th>}
                            <td>
                                <Input register={register} name={`avatars.${index}`} errors={errors} width={'350px'} />
                            </td>
                            <td>
                                <IconButton role={'delete'} size={'small'} deleteKeyword={'avatar id'} onClick={() => remove(index)} />
                            </td>
                        </tr>))}
                        <tr>
                            <td colSpan={3}>
                                <FormControlBar>
                                    <AddCounter canAddMore={canAddAvatars}>{fields.length}/{tier.avatars}</AddCounter>
                                    <IconButton role={'add'} size={'small'} disabled={!canAddAvatars} onClick={() => append('')} />
                                </FormControlBar>
                            </td>
                        </tr>
                </FormTable>
                </fieldset>
            <fieldset>
                <legend>Health system</legend>
                <p>When using an avatar that isn't set on any layout you can display a specific default layout.</p>
                <FormTable>
                    <tr>
                        <th>Enabled</th>
                        <td><CheckboxInput register={register} name={'healthEnabled'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Parameter</th>
                        <td><Input register={register} name={'healthPath'} width={'350px'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Max health</th>
                        <td><NumberInput register={register} name={'healthMax'} width={'100px'} errors={errors} /></td>
                    </tr>
                </FormTable>
            </fieldset>
            <fieldset>
                <legend>Use cost system</legend>
                <p>When using an avatar that isn't set on any layout you can display a specific default layout.</p>
                <FormTable>
                    <tr>
                        <th>Enabled</th>
                        <td><CheckboxInput register={register} name={'useCostEnabled'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Parameter</th>
                        <td><Input register={register} name={'useCostPath'} width={'350px'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Max cost?</th>
                        <td><NumberInput register={register} name={'useCostMax'} width={'100px'} errors={errors} /></td>
                    </tr>
                </FormTable>
            </fieldset>
            <FormControlBar>
                <IconButton role={'save'} disabled={!isDirty} />
                <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </Segment>)
        ;
}