import { UpdateDTO } from 'cmap2-shared';
import styled from 'styled-components';
import React, { useContext } from 'react';
import { ModalContext } from '../../../components/context/modal.context';
import BasicModal from '../../../components/modal/basicModal/basicModal.component';

interface UpdateBoxProps {
  update: UpdateDTO;
  latest?: boolean;
}

export default function UpdateBox({ update, latest }: UpdateBoxProps) {

  const { setModal } = useContext(ModalContext);

  function onDownload() {
    setModal(<BasicModal title={'Confirm download'} message={'You are about to download the update, after download is complete the application will close and install the update.'}
                         confirmValue={'Download'} confirmFunction={() => window.IPC.send('updater:start', update.download)} />);
  }

  return (<UpdateBoxStyled onClick={onDownload}>
    {latest && <h3>Latest</h3>}

    <div className={'updateBoxTitle'}>
      <h2>{update.version}</h2>
      <span>{update.date.toLocaleDateString()}</span>
    </div>

    <p>{update.description}</p>

    <span>Click to download and install</span>
  </UpdateBoxStyled>);
}

const UpdateBoxStyled = styled.div`
  border: 2px solid ${props => props.theme.colors.buttons.secondary.border};
  background: ${props => props.theme.colors.buttons.secondary.border};
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  flex-grow: 1;

  .updateBoxTitle {
    display: flex;
    flex-direction: row;
    gap: 15px;
    justify-content: space-between;
  }

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
    border: 2px solid ${props => props.theme.colors.buttons.secondary.hoverBorder};
  }
`;
