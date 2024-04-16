import { Content, ContentBox } from 'cmap2-shared/dist/react';
import DateInput from '../../shared/components/form/inputs/date.component';
import React from 'react';
import SubmitInput from '../../shared/components/form/inputs/submit.component';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';
import ButtonInput from '../../shared/components/form/inputs/button.component';

export const schema = z.object({
    date: z.date(),
});
export type thistype = z.infer<typeof schema>;

export const arraySchema = z.object({
    dates: z.array(schema),
});
export type thisarraytype = z.infer<typeof arraySchema>;


export default function GuidePage() {

    const { register, control, handleSubmit, watch, reset, formState: { errors, isDirty } } = useForm<thisarraytype>({
        defaultValues: { dates: [{ date: new Date() }] },
        resolver: zodResolver(arraySchema)
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'dates' });

    function onSubmit(formData: thisarraytype) {
        console.log(formData)
    }

    return (<Content>
        <ContentBox>
            <h2>Guide page</h2>

            <form onSubmit={handleSubmit(onSubmit)}>

                {fields.map((item, index) => (<>
                    <DateInput type={'datetime-local'} control={control} name={`dates.${index}.date`} errors={errors} />
                    <br />
                </>))}

                <SubmitInput  />
                <ButtonInput onClick={() => reset({ dates: [{ date: new Date() }, { date: new Date() }] })} text={'reset'} />
            </form>

        </ContentBox>
    </Content>
)
}
