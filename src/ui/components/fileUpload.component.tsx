import FormInput from './form/formInput.component';
import { InputType } from 'cmap2-shared';
import React from 'react';
import { useForm } from 'react-hook-form';
import useCustomFetch from '../hooks/customFetch.hook';
import { ReactProps } from '../../shared/global';

interface FileUploadProps extends ReactProps {
    parentType: string,
    parentId: string
}

export default function FileUpload({parentType, parentId}: FileUploadProps) {

    const customFetch = useCustomFetch();
    const {register, setValue, formState: {errors}, handleSubmit} = useForm();

    const onSubmit = (formData: any) => {
        if (formData.file[0]) {
            let data = new FormData();
            data.append('parentType', parentType);
            data.append('parentId', parentId);
            data.append('file', formData.file[0]);

            customFetch('file', {
                method: 'POST',
                body: data
            }).then(res => {
                // if(res?.code === 200) {
                //     setClient({...client, ...formData});
                // }
            });
        }
    };

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <FormInput type={InputType.File} register={register} name={'file'} errors={errors} />
        <FormInput type={InputType.Submit} />
    </form>);
}
