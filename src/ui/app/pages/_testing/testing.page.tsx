import { Content, ContentBox } from 'cmap2-shared/dist/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import FormTable from '../../shared/components/form/formTable.component';
import Input from '../../shared/components/form/inputs/input.component';
import CheckboxInput from '../../shared/components/form/inputs/checkbox.component';
import SubmitInput from '../../shared/components/form/inputs/submit.component';
import React from 'react';
import ButtonInput from '../../shared/components/form/inputs/button.component';
import { z } from 'zod';
import NumberInput from '../../shared/components/form/inputs/number.component';
import HiddenInput from '../../shared/components/form/inputs/hidden.component';

interface TestingForm {
    unregisteredHidden: string;
    registereHidden: string;
    unregInput: string;
    regInput: string;
    unsetInput: string;
    number: number;
    checkbox: boolean;
}

const testingSchema = z.object({
    unregisteredHidden: z.string(),
    registereHidden: z.string(),
    unregInput: z.string(),
    regInput: z.string(),
    unsetInput: z.string(),
    number: z.number(),
    checkbox: z.boolean(),
})

export default function TestingPage() {

    const { register, reset, watch, formState: { errors, isDirty }, handleSubmit } = useForm<TestingForm>({
        defaultValues: {
            unregisteredHidden: 'defaultValue',
            registereHidden: 'defaultValue',
            unregInput: 'defaultValue',
            regInput: 'defaultValue',
            number: 0,
            checkbox: false,
        },
        resolver: zodResolver(testingSchema)
    });

    function onSubmit(formData: any) {
        console.log('Submitted form data:', formData)
    }

    function onReset() {
        reset({
            unregisteredHidden: 'resetValue',
            registereHidden: 'resetValue',
            unregInput: 'resetValue',
            regInput: 'resetValue',
            number: 1,
            checkbox: true,
        });
    }

    return(<Content>
        <ContentBox>

            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Edit profile</h2>
                <FormTable>
                    <tr>
                        <th>unregisteredHidden</th>
                        <td><HiddenInput name={'unregisteredHidden'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>registereHidden</th>
                        <td><HiddenInput register={register} name={'registereHidden'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>unregInput</th>
                        <td><input name={'unregInput'} /></td>
                    </tr>
                    <tr>
                        <th>regInput</th>
                        <td><Input register={register} name={'regInput'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>unsetInput</th>
                        <td><Input register={register} name={'unsetInput'} errors={errors} /></td>
                    </tr>

                    <tr>
                        <th>number</th>
                        <td><NumberInput register={register} name={'number'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>checkbox</th>
                        <td><CheckboxInput register={register} name={'checkbox'} errors={errors} /></td>
                    </tr>
                </FormTable>
                <SubmitInput />
                <ButtonInput text={'resetCustom'} onClick={onReset}/>
                <ButtonInput text={'resetEmpty'} onClick={() => reset()}/>
                <ButtonInput text={'logErrors'} onClick={() => console.log(errors)}/>
                <ButtonInput text={'logWatch'} onClick={() => console.log(watch())}/>
            </form>

        </ContentBox>
    </Content>)
}
