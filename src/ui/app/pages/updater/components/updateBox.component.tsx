import { UpdateDTO } from 'cmap2-shared';
import styled, { css } from 'styled-components';
import useModalHook from '../../../components/modal/modal.hook';
import { useContext } from 'react';
import { ModalContext } from '../../../components/mainWindow/mainWindow.componenet';

interface UpdateBoxProps {
    update: UpdateDTO;
    latest: boolean;
}

export default function UpdateBox({ update, latest }: UpdateBoxProps) {

    const { setModal } = useContext(ModalContext);

    function onDownload() {
        setModal({
            title: 'Confirm download',
            message: 'You are about to download the update, after download is complete the application will close and install the update.',
            confirmValue: 'Download',
            confirmFunction: () => window.electronAPI.send('startUpdate', update.download)
        });
    }

    return (<UpdateBoxStyled onClick={onDownload}>
        {latest && <h3>Latest</h3>}

        <h2>{update.version}</h2>

        <p>{update.description}</p>

        <span>Click to download and install</span>
    </UpdateBoxStyled>);
}

const UpdateBoxStyled = styled.div`
  border: 2px solid ${props => props.theme.colors.buttonSecondary.border};
  background: ${props => props.theme.colors.buttonSecondary.border};
  border-radius: 8px;
  padding: 10px 15px;
  height: min-content;
  cursor: pointer;

  h2 {
    margin-top: 0;
    font-size: 18px;
    text-shadow: none;
  }

  h3 {
    margin-top: 0;
    color: ${props => props.theme.colors.success};
  }
  
  p {
    white-space: pre-line;
  }

  span {
    color: dimgrey;
  }

  :hover {
    border: 2px solid ${props => props.theme.colors.buttonSecondary.hoverBorder};
  }
`;
