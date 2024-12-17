import Segment from '../../../../components/segment/segment.component';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormTable from '../../../../components/form/formTable.component';
import Input from '../../../../components/input/input.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import React from 'react';
import { z } from 'zod';
import { convertParameterValueFromString } from 'cmap2-shared';
import ParameterInput from '../../../../components/input/parameterInput/parameterInput.component';

const vrcParameterFormSchema = z.object({
  path: z.string(),
  value: z.string(),
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
    const convertedValue = convertParameterValueFromString(formData.value);
    const value = convertedValue === undefined ? formData.value : convertedValue;
    window.IPC.send('osc:sendParameter', { path: formData.path, value: value });
  }

  return (<Segment segmentTitle={'Send parameter to VRChat'}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTable>
        <tr>
          <td style={{width: '500px'}}><ParameterInput register={register} name={'path'} placeholder={'Parameter'} setValue={setValue} errors={errors} /></td>
          <td style={{width: '200px'}}><Input register={register} name={'value'} placeholder={'Value'} errors={errors} /></td>
          <td><IconButton type={'submit'} role={'normal'} tooltip={'Send parameter'} icon={'ri-contract-right-line'} disabled={!isDirty} /></td>
        </tr>
      </FormTable>
    </form>
  </Segment>);
}