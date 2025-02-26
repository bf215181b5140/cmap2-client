import Segment from '../../../../components/segment/segment.component';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../components/form/formTable.component';
import Input from '../../../../components/input/input.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import React from 'react';
import { z } from 'zod';
import { convertParameterValueFromString, parameterValueAvatarIdSchema, parameterValueOrAvatarFormSchema } from 'cmap2-shared';
import ParameterInput from '../../../../components/input/parameterInput/parameterInput.component';

const vrcParameterFormSchema = z.object({
  path: z.string(),
  value: parameterValueOrAvatarFormSchema,
});

type VrcParameterForm = z.infer<typeof vrcParameterFormSchema>

export default function SendParameter() {

  const { register, setValue, formState: { errors, isDirty }, handleSubmit } = useForm<VrcParameterForm>({
    resolver: zodResolver(vrcParameterFormSchema),
    defaultValues: {
      path: '',
      value: '',
    }
  });

  function onSubmit(formData: VrcParameterForm) {
    window.IPC.send('osc:sendParameter', { path: formData.path, value: formData.value });
  }

  return (<Segment segmentTitle={'Send parameter to VRChat'} width={'Full'}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTable visible={true}>
        <tr>
          <td ><ParameterInput register={register} name={'path'} placeholder={'Parameter'} setValue={setValue} errors={errors} /></td>
          <td style={{width: '35%'}}><Input register={register} name={'value'} placeholder={'Value'} errors={errors} /></td>
          <td style={{width: '46px'}}><IconButton type={'submit'} role={'normal'} tooltip={'Send parameter'} icon={'ri-contract-right-line'} disabled={!isDirty} /></td>
        </tr>
      </FormTable>
    </form>
  </Segment>);
}