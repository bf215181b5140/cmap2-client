import styled from 'styled-components';
import { UploadedFileDTO, UploadedFileSchema } from 'cmap2-shared';
import React, { RefObject, useEffect, useRef } from 'react';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { useForm } from 'react-hook-form';
import { WEBSITE_URL } from '../../../../../../shared/const';
import useFileValidation from '../../../../../hooks/fileValidation.hook';

interface ProfilePictureProps {
  image: UploadedFileDTO | undefined | null;
  setImage: (file: UploadedFileDTO) => void;
}

export default function ProfilePicture({ image, setImage }: ProfilePictureProps) {

  const { cmapFetch } = useCmapFetch();
  const { validateImage } = useFileValidation();
  const { register, watch, reset, handleSubmit } = useForm<{ file: FileList }>();
  const submitRef: RefObject<HTMLInputElement> = useRef(null);
  const file = watch('file')?.item(0);
  const imageUrl = image ? WEBSITE_URL + '/' + image.urlPath : undefined;

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
        setImage(data);
        reset();
      });
    }
  }

  function onBrowse() {
    const input = document.getElementById('fileInput');
    if (input) input.click();
  }

  return (<ProfilePictureStyled hasImage={!!imageUrl} onClick={onBrowse} style={{ backgroundImage: `url(${imageUrl})` }}>

    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'none' }}>
      <input type="file" id="fileInput" {...register('file')} />
      <input type="submit" ref={submitRef} />
    </form>

    <div />
    <i className={image ? 'ri-image-edit-line' : 'ri-image-add-line'} />

  </ProfilePictureStyled>);
}

const ProfilePictureStyled = styled.div<{ hasImage: boolean }>`
    border: 3px solid ${props => props.theme.colors.ui.element3};
    border-radius: 8px;
    position: relative;
    cursor: pointer;
    transition: 0.1s linear;
    width: 100%;
    aspect-ratio: 16/9;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

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

