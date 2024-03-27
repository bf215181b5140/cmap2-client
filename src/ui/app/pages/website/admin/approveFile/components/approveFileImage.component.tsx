import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { UploadedFileDTO } from 'cmap2-shared';
import useCmapFetch from '../../../../../shared/hooks/cmapFetch.hook';

interface ApproveFileImageProps {
    file: UploadedFileDTO;
    onApprove: (file: UploadedFileDTO) => void;
    onDecline: (file: UploadedFileDTO) => void;
}

export default function ApproveFileImage({ file, onApprove, onDecline }: ApproveFileImageProps) {

    const cmapFetch = useCmapFetch();
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        cmapFetch<Blob>(`file/private?fileId=${file.id}`, {}, (data) => setImageUrl(URL.createObjectURL(data)));
    }, []);

    return (<ApproveFileImageStyled>
        {imageUrl && <img src={imageUrl} alt={file.fileName} />}
        <i className={'ri-file-check-line approve'} onClick={() => onApprove(file)} />
        <i className={'ri-file-close-line decline'} onClick={() => onDecline(file)} />
    </ApproveFileImageStyled>);
}

const ApproveFileImageStyled = styled.div`
  border: 3px solid ${props => props.theme.colors.ui.element3};
  border-radius: 8px;
  position: relative;
  min-height: 100px;
  min-width: 200px;
  max-width: 50%;
  cursor: pointer;
  transition: 0.1s linear;

  img {
    margin: 0;
    padding: 0;
    width: 100%;
    border-radius: 5px;
    display: block;
  }

  i {
    position: absolute;
    bottom: 0;
    padding: 20px 25px;
    font-size: 50px;
    filter: opacity(0.3);
    text-shadow: 0 0 3px black;

    :hover {
      filter: opacity(1);
    }
  }

  .approve {
    color: ${props => props.theme.colors.success};
    left: 0;
  }

  .decline {
    color: ${props => props.theme.colors.error};
    right: 0;
  }
  
  :hover {
    border: 3px solid ${props => props.theme.colors.input.hoverBg};
  }
`;
