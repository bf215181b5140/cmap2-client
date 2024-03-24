import { Content, ContentBox } from 'cmap2-shared/dist/react';
import FormTable, { FormTableStyled } from '../../../shared/components/form/formTable.component';
import Input from '../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../shared/components/form/inputs/select.component';
import ButtonInput from '../../../shared/components/form/inputs/button.component';
import FormControlBar from '../../../shared/components/form/formControlBar.component';
import { FieldOption } from 'cmap2-shared';
import SubmitInput from '../../../shared/components/form/inputs/submit.component';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ModalContext } from '../../../components/mainWindow/mainWindow.componenet';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { OscClockSettings, OscClockSettingsDefaults, OscClockSettingsSchema, OscClockUnit } from '../../../../../electron/osc/clock/types';
import oscClockChatboxText, { OscClockChatboxFormats } from '../../../../../electron/osc/clock/chatboxText';
import CheckboxInput from '../../../shared/components/form/inputs/checkbox.component';
import ParameterInput from '../../../shared/components/form/inputs/parameterInput.component';

export default function ClockPage() {

    const {deleteModal} = useContext(ModalContext);
    const {register, control, handleSubmit, watch, reset, formState: {errors, isDirty}, setValue} = useForm<OscClockSettings>({
        resolver: zodResolver(OscClockSettingsSchema),
        defaultValues: OscClockSettingsDefaults,
    });
    const {fields, append, remove} = useFieldArray({control, name: 'avatarParameters'});
    const [defaultValues, setDefaultValues] = useState<OscClockSettings>(OscClockSettingsDefaults);

    useEffect(() => {
        window.electronAPI.get('getOscClockSettings').then(data => {
            if (data) {
                setDefaultValues(data);
                reset(data);
            }
        });
    }, []);

    function onSave(formData: OscClockSettings) {
        window.electronAPI.send('setOscClockSettings', formData);
        reset(formData);
    }

    function onDelete(index: number) {
        remove(index);
    }

    function onReset() {
        reset(defaultValues);
    }

    const unitOptions: FieldOption[] = useMemo(() => {
        return Object.keys(OscClockUnit)
            .map((key: string) => ({key: OscClockUnit[key as keyof typeof OscClockUnit], value: key.charAt(0).toUpperCase() + key.slice(1)}));
    }, []);

    return (<Content>
        <ContentBox>
            <form onSubmit={handleSubmit(onSave)}>

                <h2>Send local time to chatbox</h2>
                <FormTable>
                    <tr>
                        <th>Send to chatbox</th>
                        <td colSpan={2}><CheckboxInput register={register} name={'sendToChatbox'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>Chatbox text</th>
                        <td><Input name={'chatboxFormat'} register={register} readOnly={!watch('sendToChatbox')} /></td>
                        <td>{oscClockChatboxText(watch('chatboxFormat'))}</td>
                    </tr>
                    <tr>
                        <th>Format options</th>
                        <td colSpan={2}>
                            <p style={{margin: 0}}>
                                {OscClockChatboxFormats.map(format => (<>{format.format + ' - ' + format.description}<br /></>))}
                            </p>
                        </td>
                    </tr>
                </FormTable>

                <br />

                <h2>Send local time to parameters</h2>
                <FormTable>
                    <tr>
                        <th>Send to avatar parameters</th>
                        <td><CheckboxInput name={'sendToAvatar'} register={register} errors={errors} /></td>
                    </tr>
                </FormTable>

                {fields.length > 0 && (<>
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
                                    <ParameterInput register={register} name={`avatarParameters.${index}.path`} readOnly={!watch('sendToAvatar')}
                                                    errors={errors} width={'350px'} setValue={setValue} defaultType={'input'} />
                                </td>
                                <td>
                                    <SelectInput register={register} name={`avatarParameters.${index}.unit`} width="auto" readOnly={!watch('sendToAvatar')}
                                                 errors={errors} options={unitOptions} />
                                </td>
                                <td>
                                    <ButtonInput text="Delete" onClick={() => deleteModal('clock parameter', () => onDelete(index))}
                                                 disabled={!watch('sendToAvatar')} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </FormTableStyled>
                    <ButtonInput text="Add new" onClick={() => append({path: '/avatar/parameters/OscLocalTimeSecond', unit: OscClockUnit.Second})}
                                 disabled={!watch('sendToAvatar')} />
                </>)}

                <FormControlBar>
                    <SubmitInput disabled={!isDirty} />
                    <ButtonInput text="Reset" disabled={!isDirty} onClick={onReset} />
                </FormControlBar>

            </form>
        </ContentBox>
    </Content>);
}
