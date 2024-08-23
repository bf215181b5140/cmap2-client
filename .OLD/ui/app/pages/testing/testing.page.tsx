import { useForm } from 'react-hook-form';
import FormTable from '../../shared/components/form/formTable.component';
import FormControlBar from '../../shared/components/form/formControlBar.component';
import SubmitInput from '../../shared/components/form/inputs/submit.component';
import Input from '../../shared/components/form/inputs/input.component';
import Content from '../../shared/components/contentBox/content.component';
import ContentBox from '../../shared/components/contentBox/contentBox.component';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';

export const TestSchema = z.object({
    string: z.string(),
    registrationKey: z.string().max(32),
})


export default function TestingPage() {

    const {register, reset, formState: {errors, isDirty}, handleSubmit, watch} = useForm({
        resolver: zodResolver(TestSchema)
    });

    function onSubmit(formData: any) {
        console.log('tesing form data', formData);
    }

    console.log(errors)

    return (<Content flexDirection="column">
        <ContentBox contentTitle={'Testing'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTable>
                    <tr>
                        <th>String</th>
                        <td><Input register={register} name={'string'} errors={errors} /></td>
                    </tr>
                    {/* <tr> */}
                    {/*     <th>registrationKey</th> */}
                    {/*     <td><Input register={register} name={'registrationKey'} readOnly={true} errors={errors} /></td> */}
                    {/* </tr> */}
                </FormTable>
                <FormControlBar>
                    <SubmitInput/>
                </FormControlBar>
            </form>
        </ContentBox>
    </Content>);
}
