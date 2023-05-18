import { globalInputStyle } from './form/formInput.component';
import React, { RefObject, useRef } from 'react';
import { useForm } from 'react-hook-form';
import useCustomFetch from '../hooks/customFetch.hook';
import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';

interface FileUploadProps extends ReactProps {
    parentType: string,
    parentId: string,
    uploadCallback?: (picture: string) => void
}

export default function FileUpload({parentType, parentId, uploadCallback}: FileUploadProps) {

    const customFetch = useCustomFetch();
    const {register, watch, reset, formState: {errors}, handleSubmit} = useForm();
    const submitRef: RefObject<HTMLInputElement> = useRef(null);
    const selectedFile = watch('file');

    const onSubmit = (formData: any) => {
        if (formData.file[0]) {
            let data = new FormData();
            data.append('parentType', parentType);
            data.append('parentId', parentId);
            data.append('file', formData.file[0]);

            customFetch<string>('file', {
                method: 'POST',
                body: data
            }).then(res => {
                if (res?.body) {
                    if (uploadCallback) uploadCallback(res.body);
                    onClearFiles();
                }
            });
        }
    };

    const onBrowse = () => {
        const input = document.getElementById('fileInput');
        if (input) input.click();
    }

    const onUpload = () => {
        if (submitRef?.current) {
            submitRef?.current?.click();
        }
    }

    const onClearFiles = () => {
        reset({file: null});
    }

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <FileInputHidden type='file' {...register('file')} id="fileInput" />
        <FileInputStyled>
            <FileName onClick={onBrowse}>{selectedFile?.[0]?.name ? selectedFile?.[0]?.name : <i className={'ri-image-add-line'} />}</FileName>
            {selectedFile?.[0]?.name && <>
                <div onClick={onUpload}><i className={'ri-upload-2-line'}/></div>
                <div onClick={onClearFiles}><i className={'ri-close-line'}/></div>
            </>}
        </FileInputStyled>
        <FileInputHidden type='submit' ref={submitRef} />
    </form>);
}

const FileInputHidden = styled.input`
  display: none;
`;

const FileInputStyled = styled.div`
  ${globalInputStyle};
  display: flex;
  flex-direction: row;
  padding: 0;
  margin: 0;
  
  :hover {
    background: ${colors['ui-primary-1']};
  }

  div {
    flex: 1;
    text-align: center;
    color: ${colors['ui-primary-2']};
    cursor: pointer;
    padding: 12px;
    transition: 0.1s linear;

    :hover {
        color: ${colors['ui-primary-4']};
      }
  }
  
  i {
    font-size: 3em;
  }
`;

const FileName = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
