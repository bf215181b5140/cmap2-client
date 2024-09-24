import styled from 'styled-components';
import { UploadedFileDTO, UploadedFileSchema } from 'cmap2-shared';
import React, { RefObject, useEffect, useRef } from 'react';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { useForm } from 'react-hook-form';
import { WEBSITE_URL } from '../../../../../../shared/const';
import useFileValidation from '../../../../../hooks/fileValidation.hook';

interface ProfilePictureProps {
    image: UploadedFileDTO | undefined | null;
    setClientPicture: (file: UploadedFileDTO) => void;
}

export default function ProfilePicture({ image, setClientPicture }: ProfilePictureProps) {

    const { cmapFetch } = useCmapFetch();
    const { validateImage } = useFileValidation();
    const { register, watch, reset, handleSubmit } = useForm<{ file: FileList }>();
    const submitRef: RefObject<HTMLInputElement> = useRef(null);
    const file = watch('file')?.item(0);

    useEffect(() => {
        if (file && submitRef?.current) {
            validateImage(file, () => submitRef?.current?.click(), () => reset());
        }
    }, [file]);

    function onSubmit(formData: { file: FileList }) {
        if (formData.file[0]) {
            let postData = new FormData();
            postData.append('file', formData.file[0]);

            cmapFetch('profile/image', {
                method: 'POST',
                body: postData
            }, UploadedFileSchema, data => {
                setClientPicture(data);
                reset();
            });
        }
    }

    function onBrowse() {
        const input = document.getElementById('fileInput');
        if (input) input.click();
    }

    return (<ProfilePictureStyled $hasImage={!!image} onClick={onBrowse}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="file" id="fileInput" {...register('file')} />
            <input type="submit" ref={submitRef} />
        </form>
        {image && <img src={WEBSITE_URL + '/' + image.urlPath} alt={image.fileName} />}
        <div />
        <i className={image ? 'ri-image-edit-line' : 'ri-image-add-line'} />
    </ProfilePictureStyled>);
}

const ProfilePictureStyled = styled.div<{ $hasImage: boolean }>`
    border: 3px solid ${props => props.theme.colors.ui.element3};
    border-radius: 8px;
    position: relative;
    width: 100%;
    height: ${props => props.$hasImage ? 'auto' : '200px'};
    cursor: pointer;
    transition: 0.1s linear;

    form {
        display: none;
    }

    img {
        border: none;
        margin: 0;
        padding: 0;
        width: 100%;
        border-radius: 5px;
        display: block;
    }

    div {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: ${props => props.theme.colors.ui.contentBg};
        transition: 0.1s linear;
        filter: opacity(0.15);
    }

    i {
        color: ${props => props.theme.colors.font.icon};
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 24px;
        filter: opacity(0.3);
        transition: 0.1s linear;
        pointer-events: none;
    }

    :hover {
        border-color: ${props => props.theme.colors.input.hoverBorder};

        div {
            filter: opacity(0.7);
        }

        i {
            font-size: 50px;
            filter: opacity(1);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

`;

