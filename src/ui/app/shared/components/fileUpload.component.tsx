import { globalInputStyle } from './form/input.style';
import React, { RefObject, useRef } from 'react';
import { useForm } from 'react-hook-form';
import useCmapFetch from '../hooks/cmapFetch.hook';
import { ReactProps, UploadedFileDTO } from 'cmap2-shared';
import styled from 'styled-components';

interface FileUploadProps extends ReactProps {
    parentType: string,
    parentId: string,
    handleUpload?: (data: any) => void;
    uploadCallback?: (picture: UploadedFileDTO) => void
}

export default function FileUpload({parentType, parentId, handleUpload, uploadCallback}: FileUploadProps) {

    const customFetch = useCmapFetch();
    const {register, watch, reset, formState: {errors}, handleSubmit} = useForm();
    const submitRef: RefObject<HTMLInputElement> = useRef(null);
    const selectedFile = watch('file');

    const onSubmit = (formData: any) => {
        if (handleUpload) {
            handleUpload(formData.file);
            onClearFiles();
        } else {
            if (formData.file[0]) {
                let data = new FormData();
                data.append('parentType', parentType);
                data.append('parentId', parentId);
                data.append('file', formData.file[0]);

                customFetch<UploadedFileDTO>('file', {
                    method: 'POST',
                    body: data
                }, data => {
                    if (uploadCallback) uploadCallback(data);
                    onClearFiles();
                });
            }
        }
    };

    const onBrowse = () => {
        const input = document.getElementById('fileInput');
        if (input) input.click();
    };

    const onUpload = () => {
        if (submitRef?.current) {
            submitRef?.current?.click();
        }
    };

    const onClearFiles = () => {
        reset({file: null});
    };

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <FileInputHidden type="file" {...register('file')} id="fileInput" />
        <FileInputStyled>
            <FileName onClick={onBrowse}>{selectedFile?.[0]?.name ? selectedFile?.[0]?.name : <i className={'ri-image-add-line'} />}</FileName>
            {selectedFile?.[0]?.name && <>
                <div onClick={onUpload}><i className={'ri-upload-2-line'} /></div>
                <div onClick={onClearFiles}><i className={'ri-close-line'} /></div>
            </>}
        </FileInputStyled>
        <FileInputHidden type="submit" ref={submitRef} />
    </form>);
}

const FileInputHidden = styled.input`
  display: none;
`;

const FileInputStyled = styled.div`
  ${globalInputStyle};
  display: flex;
  flex-direction: row;
  height: 70px;
  padding: 0;
  margin: 0;

  :hover {
    background: ${props => props.theme.colors.input.bg};
  }

  div {
    flex: 1;
    text-align: center;
    color: ${props => props.theme.colors.input.border};
    cursor: pointer;
    padding: 12px;
    transition: 0.1s linear;

    :hover {
      color: ${props => props.theme.colors.input.hoverBorder};
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
