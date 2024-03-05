import { Content, ContentBox } from 'cmap2-shared/dist/react';
import FormTable, { FormTableStyled } from '../../../shared/components/form/formTable.component';
import Input from '../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../shared/components/form/inputs/select.component';
import ButtonInput from '../../../shared/components/form/inputs/button.component';
import FormControlBar from '../../../shared/components/form/formControlBar.component';
import { FieldOption } from 'cmap2-shared';
import SubmitInput from '../../../shared/components/form/inputs/submit.component';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ModalContext } from '../../../app/mainWindow/mainWindow.componenet';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { OscClockSettings, OscClockSettingsDefaults, OscClockSettingsSchema, OscClockUnit } from '../../../../electron/osc/clock/types';
import oscClockChatboxText, { OscClockChatboxFormats } from '../../../../electron/osc/clock/chatboxText';

export default function ClockPage() {

    const {deleteModal} = useContext(ModalContext);
    const {register, control, handleSubmit, watch, reset, formState: {errors, isDirty}} = useForm<OscClockSettings>({
        resolver: zodResolver(OscClockSettingsSchema),
        defaultValues: OscClockSettingsDefaults,
    });
    const {fields, append, remove} = useFieldArray({control, name: 'avatarParameters'});
    const [defaultValues, setDefaultValues] = useState<OscClockSettings>(OscClockSettingsDefaults);

    useEffect(() => {
        window.electronAPI.get('getOscClockSettings').then(data => {
            if (data) {
                setDefaultValues(data);
                onReset();
            }
        })
    })

    function onSave(formData: OscClockSettings) {
        window.electronAPI.send('setOscClockSettings', formData);
    }

    function onDelete(index: number) {
        remove(index);
    }

    function onReset() {
        reset(defaultValues);
    }

    const unitOptions: FieldOption[] = useMemo(() => {
        return Object.keys(OscClockUnit).map((key: string) => ({key: key, value: key.charAt(0).toUpperCase() + key.slice(1)}));
    }, []);

    return (<Content>
        <ContentBox>
            <h2>Send local time to VRchat</h2>

            <form onSubmit={handleSubmit(onSave)}>
                <FormTable>
                    <tr>
                        <th>Send to chatbox</th>
                        <td><Input name={'sendToChatbox'} register={register} /></td>
                    </tr>
                    <tr>
                        <th>Chatbox text format</th>
                        <td><Input name={'chatboxFormat'} register={register} readOnly={watch('sendToChatbox')} /></td>
                    </tr>
                    <tr>
                        <th>Text preview</th>
                        <td>{oscClockChatboxText(watch('chatboxFormat'))}</td>
                    </tr>
                    <tr>
                        <th>Format options</th>
                        <td>{OscClockChatboxFormats.map(format => (<>{format.format}</>))}</td>
                    </tr>
                    <tr>
                        <th>Send to avatar parameters</th>
                        <td><Input name={'sendToAvatar'} register={register} /></td>
                    </tr>
                </FormTable>
                Send to chatbox
                <Input register={register} name="sendToChatbox" errors={errors} />

                <FormTableStyled>
                    <thead>
                    <tr>
                        <th>Path</th>
                        <th>Unit</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    {fields.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <Input register={register} name={`avatarParameters.${index}.path`} readOnly={!watch('sendToAvatar')} errors={errors} />
                            </td>
                            <td>
                                <SelectInput register={register} name={`avatarParameters.${index}.unit`} width="auto" readOnly={!watch('sendToAvatar')}
                                             errors={errors} options={unitOptions} />
                            </td>
                            <td>
                                <ButtonInput text="Delete" onClick={() => deleteModal('clock parameter', () => onDelete(index))} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </FormTableStyled>
                <hr />
                <FormControlBar>
                    <ButtonInput text="Add new" onClick={() => append({path: '/avatar/parameters/OscClockSecond', unit: OscClockUnit.Second})} />
                    <SubmitInput disabled={!isDirty} />
                    <ButtonInput text="Reset" disabled={!isDirty} onClick={onReset} />
                </FormControlBar>
            </form>
        </ContentBox>
    </Content>);
}
