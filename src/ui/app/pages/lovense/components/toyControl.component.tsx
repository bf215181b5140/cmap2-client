import { useFieldArray, useForm } from 'react-hook-form';
import { FieldOption } from 'cmap2-shared';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { FormTableStyled } from '../../../shared/components/form/formTable.component';
import FormControlBar from '../../../shared/components/form/formControlBar.component';
import React, { useEffect } from 'react';
import { ToyActionType, ToyCommandParameterForm, ToyCommandParameterFormSchema } from '../../../../../shared/lovense';
import { Toy } from 'lovense';
import Input from '../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../shared/components/form/inputs/select.component';
import NumberInput from '../../../shared/components/form/inputs/number.component';
import ParameterInput from '../../../shared/components/form/inputs/parameterInput/parameterInput.component';
import ContentBox from '../../../shared/components/contentBox/contentBox.component';
import IconButton from '../../../shared/components/buttons/iconButton.component';

interface ToyControlProps {
    toyList: Toy[] | undefined;
}

export default function ToyControl({ toyList }: ToyControlProps) {

    const { register, control, handleSubmit, watch, reset, formState: { errors, isDirty, dirtyFields }, setValue } = useForm<ToyCommandParameterForm>({
        defaultValues: { toyCommandParameters: [] }, resolver: zodResolver(ToyCommandParameterFormSchema)
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'toyCommandParameters' });

    const watchParameters = watch('toyCommandParameters');

    useEffect(() => {
        window.electronAPI.get('getToyCommandParameters').then(toyCommandParameters => {
            reset({ toyCommandParameters }, { keepDirty: false });
        });
    }, []);

    function onAdd() {
        append({
            parameterPath: '',
            action: ToyActionType.All,
            timeSec: 1,
            toy: ''
        });
    }

    function onsubmit(formData: ToyCommandParameterForm) {
        window.electronAPI.send('setToyCommandParameters', formData.toyCommandParameters);
        reset(formData, { keepDirty: false });
    }

    function ToyActionTypeOptions(): FieldOption[] {
        return Object.keys(ToyActionType)
            .map((key: string) => ({ key: ToyActionType[key as keyof typeof ToyActionType], value: ToyActionType[key as keyof typeof ToyActionType] }));
    }

    return (<ContentBox contentTitle={'Toy control'} infoContent={LovenseToyControlInfo()}>
        <form onSubmit={handleSubmit(onsubmit)}>
            <FormTableStyled>
                <thead>
                {watchParameters.length > 0 &&
                    <tr>
                        <th>Parameter</th>
                        <th>Lovense toy action</th>
                        <th>Time (seconds)</th>
                        <th>Toy id</th>
                    </tr>
                }
                </thead>
                <tbody>
                {fields.map((item, index) => (
                    <tr key={index}>
                        <td>
                            <ParameterInput register={register} name={`toyCommandParameters.${index}.parameterPath`} errors={errors}
                                            setValue={setValue} defaultType={'output'} />
                        </td>
                        <td>
                            <SelectInput name={`toyCommandParameters.${index}.action`} width="160px" register={register} errors={errors}
                                         options={ToyActionTypeOptions()} />
                        </td>
                        <td>
                            <NumberInput name={`toyCommandParameters.${index}.timeSec`} width="120px" register={register}
                                         errors={errors} />
                        </td>
                        <td>
                            {/* todo add text + select input with toyList */}
                            <Input name={`toyCommandParameters.${index}.toy`} register={register} errors={errors} />
                        </td>
                        <td>
                            <IconButton type={'delete'} size={'small'} deleteKeyword={'setting'} onClick={() => remove(index)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </FormTableStyled>
            <hr />
            <FormControlBar>
                <IconButton type={'add'} size={'small'} onClick={onAdd} />
                <hr />
                <IconButton type={'save'} disabled={!isDirty} />
                <IconButton type={'reset'} disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}

function LovenseToyControlInfo() {
    return (<>
        <p>Control Lovense toys based on avatar parameters VRChat sends out. You can use it with VRCFury penetration contacts or your own custom contacts.
            <ul>
                <li><b>Parameter</b>: parameter that will trigger toy action. You probably want a physbone contact on your avatar that sends a parameter.
                    <br />
                    Strength of the vibration will be determined based on type of parameter:
                    <ul>
                        <li><b>Bool</b>: maximum toy vibration strength for true, no vibration for false.</li>
                        <li><b>Int</b>: number will be used as vibration strength, most toys support numbers between 0 and 20 (0 is no vibration, over 20 will be treated as 20).</li>
                        <li><b>Float</b>: number will be used as percentage (0 to 1 as 0% to 100%) to calculate strength.</li>
                    </ul>
                </li>
                <li><b>Lovense toy action</b>: different lovense toys have different type of vibrations they can do. "All" is a safe choice if you're not sure
                    what your toy supports. "Stop" will stop all vibrations.
                </li>
                <li><b>Time</b>: how long to vibrate the toy. 0 is infinite and you will need to stop vibration yourself or with a different action.</li>
                <li><b>Toy id</b>: if you have multiple toys connected you can specify toy id to only vibrate that toy. Leave empty to vibrate all connected
                    toys (or if you only have one toy). You can find your toy id in the "Toys" section above once you're connected to lovense.
                </li>
            </ul>
        </p>
    </>);
}
