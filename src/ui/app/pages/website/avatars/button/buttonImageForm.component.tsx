import { useForm } from 'react-hook-form';
import React, { RefObject, useEffect, useImperativeHandle, useRef } from 'react';
import { ButtonDTO, UploadedFileDTO } from 'cmap2-shared';
import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import styled from 'styled-components';
import EventEmitter from 'events';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import useFileValidation from '../../../../shared/hooks/fileValidation.hook';
import IconButton from '../../../../shared/components/buttons/iconButton.component';

interface ButtonImageFormProps {
    button: ButtonDTO;
    onSave: (data: UploadedFileDTO | null) => void;
    onLocalFile: (data?: File | null) => void;
    buttonEmitter: EventEmitter;
}

export default function ButtonImageForm({ button, onSave, buttonEmitter, onLocalFile }: ButtonImageFormProps) {

    const customFetch = useCmapFetch();
    const validateFile = useFileValidation();
    const { register, watch, reset, handleSubmit } = useForm<{ file: FileList | null }>();
    const { ref, ...fileRegister } = register('file');
    const inputRef: RefObject<HTMLInputElement> = useRef(null);
    const submitRef: RefObject<HTMLInputElement> = useRef(null);
    const file = watch('file')?.item(0);

    useImperativeHandle(ref, () => inputRef.current);

    useEffect(() => {
        function onButtonSave(data: ButtonDTO) {
            button.id = data.id;
            submitRef.current?.click();
        }

        buttonEmitter.on('save', onButtonSave);

        return () => {
            buttonEmitter.removeListener('save', onButtonSave);
        };
    }, []);

    useEffect(() => {
        if (file) {
            validateFile(file, 'image', () => onLocalFile(file), () => reset());
        } else {
            onLocalFile(file);
        }
    }, [file]);

    function onSubmit(formData: any) {
        if (formData.file[0] && button.id) {
            let data = new FormData();
            data.append('file', formData.file[0]);
            data.append('id', button.id);

            customFetch<UploadedFileDTO>('button/image', {
                method: 'POST',
                body: data
            }, data => {
                onSave(data);
                reset();
            });
        }
    }

    function onClear() {
        if (file) {
            onLocalFile(null);
            reset();
        } else if (button.image) {
            customFetch<UploadedFileDTO>('button/image', {
                method: 'DELETE',
                body: JSON.stringify({ id: button.id }),
                headers: { 'Content-Type': 'application/json' }
            }, () => {
                onSave(null);
                reset();
            });
        }
    }

    function onBrowse() {
        inputRef?.current?.click();
    }

    const browseIcon = !!file ? 'ri-image-edit-line' : 'ri-image-add-line';

    return (<ButtonImageFormStyled>
        <div style={{ flexBasis: '100%' }}>
            <span style={{ flexBasis: '100%' }} className={'fileName'}>{file?.name}</span>
        </div>
        <div>
            <IconButton role={'normal'} tooltip={'Browse for file'} icon={browseIcon} onClick={onBrowse} />
        </div>
        <div>
            <IconButton role={'save'} tooltip={'Save image'} onClick={() => submitRef.current?.click()} disabled={!file || !button.id} />
            <ButtonInput text={'Remove image'} onClick={onClear} disabled={!file && !button.image} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'none' }}>
            <input type="file" {...fileRegister} ref={inputRef} />
            <input type="submit" ref={submitRef} />
        </form>
    </ButtonImageFormStyled>);
}

const ButtonImageFormStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  span.fileName {
    display: block;
    max-width: 270px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0;
    margin: 0;
  }
`;
