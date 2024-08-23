import React from 'react';
import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';
import { Icon } from 'cmap2-shared/src/react';
import { Modal } from './modal.hook';
import ButtonInput from '../../shared/components/form/inputs/button.component';

export interface ModalComponentProps extends ReactProps {
    modal: Modal | null;
    clearModal: () => void;
}

export default function ModalComponent({modal, clearModal}: ModalComponentProps) {

    function onClose() {
        modal?.cancelFunction?.apply(null);
        clearModal();
    }

    function onConfirm() {
        modal?.confirmFunction.apply(null);
        clearModal();
    }

    if (!modal) {
        return null;
    }

    return (<ModalWrapper>
        <ModalStyled>
            <ModalTitle>
                <h2>{modal.title || 'Confirmation required'}</h2>
                <span onClick={onClose}><Icon icon="ri-close-line" /></span>
            </ModalTitle>
            <ModalContent>
                <p>{modal.message || 'Confirm your action'}</p>
                <div id="confirmation">
                    <ButtonInput text={modal.confirmValue || 'Confirm'} onClick={onConfirm} />
                </div>
            </ModalContent>
        </ModalStyled>
    </ModalWrapper>);
}

const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
  backdrop-filter: blur(2px);
`;

const ModalStyled = styled.div`
  background-color: ${props => props.theme.colors.ui.contentBg};
  border: 2px solid ${props => props.theme.colors.ui.appBg};
  border-radius: 8px;
  min-width: 350px;
  max-width: 600px;
  min-height: 125px;
  max-height: 400px;
`;

const ModalTitle = styled.div`
  background-color: ${props => props.theme.colors.input.bg};
  border-bottom: 1px solid ${props => props.theme.colors.ui.appBorder};
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px;
  gap: 10px;

  h2 {
    margin: 0;
    padding: 0;
  }

  span {
    padding: 0 5px;
    font-size: 20px;
    display: block;
    cursor: pointer;
  }
`;

const ModalContent = styled.div`
  padding: 10px;

  #confirmation {
    margin-top: 10px;
    text-align: end;
  }
`;
